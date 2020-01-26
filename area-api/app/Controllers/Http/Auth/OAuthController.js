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
            data: encodeURIComponent(this.getServiceAuthorizeUrl(service, params.clientType))
        });
    }

    async connectUser(auth, userService, response) {
        try {
            const user = await userService.user().fetch();
            return response.json({
                status: 'success',
                data: await auth.generate(user)
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
            login_source: serviceName
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
            console.log(err);
            return response.status(400).json({
                status: 'error',
                message: 'Cannot create the user. Please, try again later.'
            });
        }
    }

    async signin({ auth, params, request, response }) {
        const parameters = request.only(['authCode', 'clientType']);

        if (typeof parameters.authCode === 'undefined' ||
            typeof parameters.clientType === 'undefined') {
            return response.status(400).json({
                status: 'error',
                message: 'Invalid parameters'
            });
        }

        if (!(params.serviceName in Services)) {
            return response.status(404).json({
                status: 'error',
                message: 'Service not found'
            });
        }

        const service = Services[params.serviceName];
        const accessToken = await this.getAccessToken(
            service,
            parameters.authCode,
            parameters.clientType
        );

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

        let userService = null;
        try {
            userService = await Service.query()
                  .where('email', serviceUser.email)
                  .where('name', params.serviceName)
                  .first();
        } catch (err) {
            console.log(err);
            return response.status(400).json({
                status: 'error',
                message: 'An error as occured. Please, try again later'
            });
        }

        console.log(userService);
        if (userService !== null) {
            console.log('connect');
            return this.connectUser(auth, userService, response);
        } else {
            console.log('create');
            return this.createUser(auth, params.serviceName, serviceUser, accessToken, response);
        }
    }


    getServiceAuthorizeUrl(service, clientType) {
        const scopes = service.scopes.length > 0 ? 'scope=' + service.scopes.join(service.scopeSeparator) : '';
        const client_id = 'client_id=' + ApiInfos[clientType][service.name].client_id;
        const redirect_uri = 'redirect_uri=' + ApiInfos[clientType][service.name].redirect_uri;
        const response_type = 'response_type=code';
        const url = service.authorizeUrl + '?' + [scopes, client_id, redirect_uri, response_type].filter(Boolean).join('&');
        return url;
    }

    async getAccessToken(service, code, clientType) {
        if (service.irregularAccessToken) {
            return await service.getAccessToken(code, clientType);
        }
        const data = querystring.stringify({
            client_id: ApiInfos[clientType][service.name].client_id,
            client_secret: ApiInfos[clientType][service.name].client_secret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: ApiInfos[clientType][service.name].redirect_uri
        });

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
