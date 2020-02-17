'use strict'

const Config = use('Config')
const Area = Config.get('area.config');

class ServerController {

    async getServerInfos({request, response}) {
        
        const client = {
            host: request.ip()
        };
        const server = {
            current_time: null,
            services: Area
        };
        const data = {
            client: client,
            server: server
        };

        return response.json({
            data
        });
    }

}

module.exports = ServerController
