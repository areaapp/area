'use strict'

const Services = use('App/Services/index');
const User = use('App/Models/User');

class ServiceController {

    getServiceInfos(service) {
        return {
            authType: service.authType,
            name: service.name,
            displayName: service.displayName,
            description: service.description,
            baseUrl: service.baseUrl,
            iconName: service.iconName,
            foreground: service.foreground,
            background: service.background,
        };
    }

    getServices({ request, response }) {
        let services = [];
        for (let serviceName in Services) {
            let service = this.getServiceInfos(Services[serviceName]);
            const { actions, reactions } = request.areaHelper.getServiceAll(serviceName);
            service.actions = actions;
            service.reactions = reactions;
            services.push(service);
        }

        return response.json({
            status: 'success',
            data: services
        });
    }

    getService({ params, request, response }) {
        const serviceName = params.name;

        if (!(serviceName in Services)) {
            return response.status(404).json({
                status: 'error',
                message: 'Service not found'
            });
        }

        let service = this.getServiceInfos(Services[serviceName]);
        const { actions, reactions } = request.areaHelper.getServiceAll(serviceName);
        service.actions = actions;
        service.reactions = reactions;

        return response.json({
            status: 'success',
            data: service
        });
    }

    getServiceActions({ params, request, response }) {
        const serviceName = params.name;

        if (!(serviceName in Services)) {
            return response.status(404).json({
                status: 'error',
                message: 'Service not found'
            });
        }

        return response.json({
            status: 'success',
            data: request.areaHelper.getServiceActions(serviceName)
        });
    }

    getServiceReactions({ params, request, response }) {
        const serviceName = params.name;

        if (!(serviceName in Services)) {
            return response.status(404).json({
                status: 'error',
                message: 'Service not found'
            });
        }

        return response.json({
            status: 'success',
            data: request.areaHelper.getServiceReactions(serviceName)
        });
    }
}

module.exports = ServiceController
