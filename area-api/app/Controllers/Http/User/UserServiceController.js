'use strict'

const Services = use('App/Services/index');
const Service = use('App/Models/Service');

class UserServiceController {

    async addService({ auth, params, request, response }) {
        try {
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

            if (!(params.serviceName in Services)) {
                return response.status(404).json({
                    status: 'error',
                    message: 'Invalid service'
                });
            }

            const service = Services[params.serviceName];
            let accessToken = '22b93eff1349d4f4392ccc8de3eb1c6388aa69b5';
            // try {
            //     accessToken = await service.getAccessToken({
            //         code: parameters.authCode,
            //         clientType: parameters.clientType
            //     });
            // } catch (err) {
            //     return response.status(401).json({
            //         status: 'error',
            //         message: 'Cannot get access_token'
            //     });
            // }

            const serviceUser = await service.getUser(accessToken);

            const userService = await Service.query()
                  .where('email', serviceUser.email)
                  .where('name', params.serviceName)
                  .first();

            if (userService !== null) {
                return response.status(400).json({
                    status: 'error',
                    message: 'This email for this service is already added by another user'
                });
            }
            const serviceInfos = {
                name: params.serviceName,
                oauth_token: accessToken,
                oauth_refresh_token: null,
                email: serviceUser.email,
            };

            await auth.current.user.services().create(serviceInfos);

            return response.json({
                status: 'success'
            });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = UserServiceController
