'use strict'

const Services = use('App/Services/index');

class ServiceController {

    getServices({ response }) {
        let services = [];
        for (let serviceName in Services) {
            services.push({
                authType: Services[serviceName].authType,
                name: Services[serviceName].name,
                displayName: Services[serviceName].displayName,
                description: Services[serviceName].description,
                baseUrl: Services[serviceName].baseUrl,
                iconName: Services[serviceName].iconName,
                foreground: Services[serviceName].foreground,
                background: Services[serviceName].background,
            });
        }

        return response.json({
            status: 'sucess',
            data: services
        });
    }

    getService({ params, response }) {
        const serviceName = params.name;
        let service = null;

        if (!(serviceName in Services)) {
            return response.status(404).json({
                status: 'error',
                message: 'Service not found'
            });
        }

        service = ({
            authType: Services[serviceName].authType,
            name: Services[serviceName].name,
            displayName: Services[serviceName].displayName,
            description: Services[serviceName].description,
            baseUrl: Services[serviceName].baseUrl,
            iconName: Services[serviceName].iconName,
            foreground: Services[serviceName].foreground,
            background: Services[serviceName].background, 
        })

        return response.status(400).json({
            status: 'success',
            data: service
        });
    }
}

module.exports = ServiceController
