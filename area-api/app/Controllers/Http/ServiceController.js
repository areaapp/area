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
}

module.exports = ServiceController
