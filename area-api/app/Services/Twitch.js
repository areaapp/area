'use strict'

const axios = require('axios');

module.exports = {
    authType: 'oauth',
    name: 'Twitch',
    description: '',
    baseUrl: 'https://twitch.tv/',
    authorizeUrl: 'https://id.twitch.tv/oauth2/authorize?scope=user:read:email&response_type=token&client_id=',
    accessTokenUrl: 'https://id.twitch.tv/oauth2/token',

    async getUser(accessToken) {
        const url = "https://api.twitch.tv/helix/users";
        const response = await axios.get(url, {
            headers: {'Authorization': 'token ' + accessToken}
        });

        const user = {
            username: response.display_name,
            email: response.email
        };
        return user;
    }
}
