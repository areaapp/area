'use strict'

const Services = use('App/Services/index');
const Service = use('App/Models/Service');
const User = use('App/Models/User');

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
            data: service.authorizeUrl
        });
    }

    getAccessTokenUrl({ params, response }) {
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
            data: service.accessTokenUrl
        });
    }


    async signin({ auth, request, response }) {
        const serviceName = request.input('service', null);
        const accessToken = request.input('accessToken', null);

        if (serviceName === null || accessToken === null) {
            return response.status(400).json({
                status: 'error',
                message: 'Service or access_token invalid'
            });
        }

        const service = Services[serviceName];
        const serviceUser = await service.getUser(accessToken);

        try {
            const user = await User.findByOrFail('email', serviceUser.email);
            const jwt = await auth.generate(user);

            return response.json({
                status: 'success',
                data: token
            });
        } catch (err) {
            const userInfos = {
                username: serviceUser.username,
                email: serviceUser.email,
                login_source: serviceName
            };

            const user = await User.create(userInfos);

            const serviceInfos = {
                name: serviceName,
                oauth_token: accessToken,
                oauth_refresh_token: null
            };

            await user.services().create(serviceInfos);

            const jwt = await auth.generate(user);

            return response.json({
                status: 'success',
                data: jwt
            });
        }
    }
}

module.exports = OAuthController
