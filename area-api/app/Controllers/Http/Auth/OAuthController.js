'use strict'

const Services = use('App/Services/index');
const Service = use('App/Models/Service');
const User = use('App/Models/User');
const ApiInfos = require('../../../../oauth.config.js');
const axios = require('axios');
const querystring = require('querystring');

class OAuthController {
    getAuthorizeUrl({ params, response }) {
        if (!(params.serviceName in Services)) {
            return response.status(404).json({
                status: 'error',
                message: 'Service not found'
            });
        }

        const service = Services[params.serviceName];

        if (service.authType !== 'oauth') {
            return response.status(400).json({
                status: 'error',
                message: 'This service does not use OAuth authentication'
            });
        }

        return response.json({
            status: 'success',
            data: this.getServiceAuthorizeUrl(service, params.clientType)
        });
    }

    async connectUser(auth, user, response) {
        try {
            const userAuth = await auth.generate(user);

            return response.json({
                status: 'success',
                data: userAuth
            });
        } catch (err) {
            console.log(err);
            return response.status(400).json({
                status: 'error',
                message: 'Cannot connect the user. Please, try again later.'
            });
        }
    }

    async createUser(auth, serviceName, serviceUser, accessToken, response) {
        const userInfos = {
            username: serviceUser.username,
            email: serviceUser.email,
            password: null,
            register_source: serviceName
        };

        const serviceInfos = {
            name: serviceName,
            email: serviceUser.email,
            oauth_token: accessToken,
            oauth_refresh_token: null
        };

        try {
            const user = await User.create(userInfos);
            await user.services().create(serviceInfos);
            return response.json({
                status: 'success',
                data: await auth.generate(user)
            });
        } catch (err) {
            let message = 'Cannot create the user. Please, try again later.';
            if (err.routine === '_bt_check_unique') {
                message = 'This email already exists.';
            }
            return response.status(400).json({
                status: 'error',
                message
            });
        }
    }

    async signin({ auth, request, response }) {
        const parameters = request.only(['authCode', 'accessToken', 'clientType', 'service']);

        if (typeof parameters.clientType === 'undefined' ||
            typeof parameters.service === 'undefined') {
            return response.status(400).json({
                status: 'error',
                message: 'Invalid parameters'
            });
        }

        if (typeof parameters.authCode === typeof parameters.accessToken) {
            return response.status(400).json({
                status: 'error',
                message: 'authCode or accessToken invalid'
            });
        }

        if (!(parameters.service in Services)) {
            return response.status(404).json({
                status: 'error',
                message: 'Service not found'
            });
        }

        const service = Services[parameters.service];

        let accessToken = null;

        if (typeof parameters.accessToken !== 'undefined') {
            accessToken = parameters.accessToken;

            // Check access token ?
        } else {
            accessToken = await this.constructor.getAccessToken(
                service,
                parameters.authCode,
                parameters.clientType
            );
        }

        if (accessToken === null) {
            return response.status(400).json({
                status: 'error',
                message: 'Cannot retreive access_token'
            });
        }

        const serviceUser = await service.getUser(accessToken);

        if (serviceUser === null) {
            return response.status(400).json({
                status: 'error',
                message: 'An error as occured. Please, try again later'
            });
        }

        let user = null;
        try {
            user = await User.findBy('email', serviceUser.email);

            if (user !== null && user.register_source !== parameters.service) {
                return response.status(400).json({
                    status: 'error',
                    message: 'This user registered through ' + user.register_source + '.'
                });
            }

        } catch (err) {
            console.log(err);
            return response.status(400).json({
                status: 'error',
                message: 'An error as occured. Please, try again later'
            });
        }

        if (user !== null) {
            return await this.connectUser(auth, user, response);
        } else {
            return await this.createUser(auth, parameters.service, serviceUser, accessToken, response);
        }
    }


    getServiceAuthorizeUrl(service, clientType) {
        const scopes = service.scopes.length > 0 ? 'scope=' + service.scopes.join(service.scopeSeparator) : '';
        const client_id = 'client_id=' + ApiInfos[clientType][service.name].client_id;
        let redirect_uri = ''
        if (ApiInfos[clientType][service.name].redirect_uri) {
            redirect_uri = 'redirect_uri=' + encodeURIComponent(ApiInfos[clientType][service.name].redirect_uri);
        }
        const response_type = 'response_type=' + (service.codeFlow ? 'code' : 'token');
        const url = service.authorizeUrl + '?' + [scopes, client_id, redirect_uri, response_type].filter(Boolean).join('&');
        return url;
    }

    static async getAccessToken(service, code, clientType) {
        if (service.irregularAccessToken) {
            return await service.getAccessToken(code, clientType);
        }

        let dataObj = {
            client_id: ApiInfos[clientType][service.name].client_id,
            client_secret: ApiInfos[clientType][service.name].client_secret,
            code,
            grant_type: 'authorization_code',
        }

        if (ApiInfos[clientType][service.name].redirect_uri) {
            dataObj.redirect_uri = ApiInfos[clientType][service.name].redirect_uri
        }
        const data = querystring.stringify(dataObj);

        try {
            const response = await axios.post(service.accessTokenUrl, data);
            return response.data.access_token;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}

module.exports = OAuthController
