'use strict'

const axios = require('axios');
const querystring = require('querystring');
const ApiInfos = require('../../oauth.config.js');

module.exports = {
    authType: 'oauth',
    name: 'spotify',
    displayName: 'Spotify',
    description: 'plus tard',
    baseUrl: 'www.spotify.com',
    iconName: 'spotify',
    foreground: '#ffffff',
    background: '#1ed761',
    irregularAccessToken: false,
    authorizeUrl: "https://accounts.spotify.com/authorize",
    accessTokenUrl: 'https://accounts.spotify.com/api/token',
    scopeSeparator: '%20',
    scopes: [
        'user-read-email'
    ],

    async getUser(accessToken) {
        try {
            const url = "https://api.spotify.com/v1/me";
            const response = await axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                }
            });

            const user = {
                username: response.data.display_name,
                email: response.data.email
            };
            return user;
        } catch (err) {
            console.log(err);
        }
    }
}
