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
        const accessToken = await service.getAccessToken({
            code: parameters.authCode,
            clientType: parameters.clientType
        });
        const serviceUser = await service.getUser(accessToken);

        return response.json({
            status: 'success',
            data: accessToken
        });

        try {
            const user = await User.findByOrFail('email', serviceUser.email);

            console.log(user);

            const jwt = await auth.generate(user);

            return response.json({
                status: 'success',
                data: jwt
        });
        } catch (err) {
            const userInfos = {
                username: serviceUser.username,
                email: serviceUser.email,
                login_source: params.service
            };

            const user = await User.create(userInfos);

            const serviceInfos = {
                name: params.serviceName,
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
