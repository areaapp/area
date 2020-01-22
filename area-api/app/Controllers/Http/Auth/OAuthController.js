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
            data: service.getAuthorizeUrl(params.clientType)
        });
    }

    async signin({ auth, params, request, response }) {
        const paramNames = ['authCode', 'clientType'];
        const parameters = request.only(paramNames);

        for (let paramName of paramNames) {
            if (typeof parameters[paramName] === 'undefined') {
                return response.status(400).json({
                    status: 'error',
                    message: paramName + ' invalid'
                });
            }
        }

        const service = Services[params.serviceName];
        let accessToken = null;
        try {
            accessToken = await service.getAccessToken({
                code: parameters.authCode,
                clientType: parameters.clientType
            });
        } catch (err) {
            return response.status(400).json({
                status: 'error',
                message: 'Cannot retreive access_token'
            });
        }
        const serviceUser = await service.getUser(accessToken);

        const userService = await Service.query()
              .where('email', serviceUser.email)
              .where('name', params.serviceName)
              .first();

        if (userService !== null) {
            const user = await userService.user().fetch();
            console.log(user);
            const jwt = await auth.generate(user);

            return response.json({
                status: 'success',
                data: jwt
            });

        } else {
            const userInfos = {
                username: serviceUser.username,
                email: serviceUser.email,
                password: null,
                login_source: params.serviceName
            };

            const user = await User.create(userInfos);

            const serviceInfos = {
                name: params.serviceName,
                email: serviceUser.email,
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
