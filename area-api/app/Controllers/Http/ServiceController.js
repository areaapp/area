'use strict'

const Services = use('App/Services/index');
const User = use('App/Models/User');
const Area = require('../../../area.config.js');

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

    getServices({ response }) {
        let services = [];
        for (let serviceName in Services) {
            let service = this.getServiceInfos(Services[serviceName]);
            service.actions = Area[serviceName].actions;
            service.reactions = Area[serviceName].reactions;
            services.push(service);
        }

        return response.json({
            status: 'success',
            data: services
        });
    }

    getService({ params, response }) {
        const serviceName = params.name;

        if (!(serviceName in Services)) {
            return response.status(404).json({
                status: 'error',
                message: 'Service not found'
            });
        }

        let service = this.getServiceInfos(Services[serviceName]);
        service.actions = Area[serviceName].actions;
        service.reactions = Area[serviceName].reactions;

        return response.status(400).json({
            status: 'success',
            data: service
        });
    }
}

module.exports = ServiceController
