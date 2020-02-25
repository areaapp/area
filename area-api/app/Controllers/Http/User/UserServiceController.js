'use strict';

const Services = use('App/Services/index');
const Service = use('App/Models/Service');
const User = use('App/Models/User');
const OAuthController = use('App/Controllers/Http/Auth/OAuthController');

class UserServiceController {

    async addRegularService(auth, service, response) {
        const res = await auth.current.user.services().where('name', service.name).fetch();

        if (res.rows.length > 0) {
            return response.status(400).json({
                status: 'error',
                message: 'This service already exists'
            });
        }

        const serviceInfos = {
            name: service.name,
            oauth_token: null,
            oauth_refresh_token: null,
            email: null,
        };

        try {
            const newService = await auth.current.user.services().create(serviceInfos);

            return response.json({
                status: 'success',
                data: newService
            });
        } catch (err) {
            console.log(err);
            return response.status(400).json({
                status: 'error',
                message: 'Cannot create regular service'
            });
        }
    }

    async addService({ auth, params, request, response }) {
        if (!(params.serviceName in Services)) {
            return response.status(404).json({
                status: 'error',
                message: 'Invalid service'
            });
        }

        const service = Services[params.serviceName];

        if (service.authType === 'none') {
            return await this.addRegularService(auth, service, response);
        }

        const res = await auth.current.user.services().where('name', service.name).fetch();
        if (res.rows.length > 0) {
            return response.status(400).json({
                status: 'error',
                message: 'This service already exists'
            });
        }

        const paramNames = ['authCode', 'accessToken', 'clientType'];
        const parameters = request.only(paramNames);

        if (!parameters.clientType) {
            return response.status(400).json({
                status: 'error',
                message: 'clientType invalid'
            });
        }

        if (typeof parameters.authCode === typeof parameters.accessToken) {
            return response.status(400).json({
                status: 'error',
                message: 'authCode or accessToken invalid'
            });
        }

        let accessToken = null;
        if (typeof parameters.accessToken !== 'undefined') {
            accessToken = parameters.accessToken;
        } else {
            accessToken = await OAuthController.getAccessToken(
                request.oauthHelper,
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

        const newService = await auth.current.user.services().create(serviceInfos);

        return response.json({
            status: 'success',
            data: newService
        });
    }

    async getUserServices({auth, response}) {
        const userService = await Service.query()
              .where('user_id', auth.current.user.id)
              .fetch();

        const userServicesInfos = userService.toJSON();
        let services = {};

        for (var i = 0; i < userServicesInfos.length; i++) {
            let service = {
                name: userServicesInfos[i].name,
                email: userServicesInfos[i].email
            };

            services[service.name] = service;
        }

        return response.json({
            status: 'success',
            data: services
        });
    }

    async deleteService({auth, params, response}) {

        if (auth.current.user.register_source === params.name) {
            return response.status(400).json({
                status: 'error',
                message: 'This service is used to authenticate the user, it cannot be deleted'
            });
        }

        const userService = await Service.query()
        .where('user_id', auth.current.user.id)
        .where('name', params.name)
        .fetch();

        if (userService.rows.length == 0) {
            return response.status(404).json({
                status: 'error',
                message: 'The service doesn\'t exist for this user'
            });
        }

        const serviceInfos = {
            name: userService.rows[0].name,
            email: userService.rows[0].email
        };

        try {
            await userService.rows[0].delete();
        } catch (err) {
            console.log(err);
            return response.status(400).json({
                status: 'error',
                message: 'Unable to delete service'
            });
        }

        return response.json({
            status: 'success',
            data: serviceInfos
        });
    }
}

module.exports = UserServiceController;
