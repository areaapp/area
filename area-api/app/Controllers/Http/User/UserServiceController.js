'use strict'

const Services = use('App/Services/index');
const Service = use('App/Models/Service');
const User = use('App/Models/User');
const OAuthController = use('App/Controllers/Http/Auth/OAuthController');

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
            const accessToken = await OAuthController.getAccessToken(
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

    async getUserServices({auth, response}) {
        try {
            const userService = await Service.query()
            .where('user_id', auth.current.user.id)
            .fetch();

            return response.json({
                status: 'success',
                data: userService
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    async deleteService({auth, params, response}) {
        const userService = await Service.query()
        .where('user_id', auth.current.user.id)
        .where('name', params.name)
        .fetch();

        if (userService.rows.length == 0)
            return response.status(404).json({
                status: 'error',
                message: 'The service doesn\'t exist for this user'
            });

        await Service.query()
        .where('user_id', auth.current.user.id)
        .where('name', params.name)
        .delete();

        return response.json({
            status: 'success',
            message: 'The service ' + params.name + ' is suppressed'
        });
    }
}

module.exports = UserServiceController
