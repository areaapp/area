'use strict'

const axios = require('axios');
const querystring = require('querystring');

module.exports = {
    authType: 'oauth',
    name: 'twitch',
    displayName: 'Twitch',
    description: 'plus tard',
    baseUrl: 'https://twitch.tv/',
    iconName: 'twitch',
    foreground: '#ffffff',
    background: '#6441a4',
    irregularAccessToken: false,
    codeFlow: true,
    authorizeUrl: 'https://id.twitch.tv/oauth2/authorize',
    accessTokenUrl: 'https://id.twitch.tv/oauth2/token',
    scopeSeparator: '+',
    scopes: [
        'user:read:email'
    ],

    async getUser(accessToken) {
        const url = "https://api.twitch.tv/helix/users";

        try {
            const response = await axios.get(url, {
                headers: {'Authorization': 'Bearer ' + accessToken}
            });

            return {
                username: response.data.data[0].display_name,
                email: response.data.data[0].email
            };
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
