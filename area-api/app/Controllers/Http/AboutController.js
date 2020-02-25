'use strict'

const Config = use('Config')
const Area = Config.get('area.config');

class AboutController {
    getServiceInfos(service) {
        let actions = [];
        let reactions = [];
        let obj = null;

        for (var i = 0; i < Area[service].actions.length; i++) {
            obj = {
                name: Area[service].actions[i].displayName,
                description: Area[service].actions[i].description
            };
            actions.push(obj);
        }
        for (var i = 0; i < Area[service].reactions.length; i++) {
            obj = {
                name: Area[service].reactions[i].displayName,
                description: Area[service].reactions[i].description
            };
            reactions.push(obj);
        }

        const serviceInfos = {
            name: service,
            actions: actions,
            reactions: reactions
        };

        return serviceInfos;
    }

    async generateAbout({request, response}) {

        const client = {
            host: request.ip()
        };
        let server = {
            current_time: Math.floor(Date.now()/1000),
            services: []
        };
        let serviceInfos = null;

        for (let service in Area) {
            serviceInfos = this.getServiceInfos(service);
            server.services.push(serviceInfos);
        }

        const data = {
            client: client,
            server: server
        }

        return response.json({
            data
        });
    }
}

module.exports = AboutController
