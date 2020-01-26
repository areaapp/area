'use strict'

const axios = require('axios');
const querystring = require('querystring');
const ApiInfos = require('../../oauth.config.js');

module.exports = {
    authType: 'oauth',
    name: 'dropbox',
    displayName: 'Dropbox',
    description: 'plus tard',
    baseUrl: 'www.dropbox.com',
    iconName: 'dropbox',
    foreground: '',
    background: '',
    irregularAccessToken: false,
    authorizeUrl: "https://www.dropbox.com/oauth2/authorize",
    accessTokenUrl: 'https://api.dropboxapi.com/oauth2/token',
    scopeSeparator: '%20',
    scopes: [
    ],

    async getUser(accessToken) {
        try {
            const url = "https://api.dropboxapi.com/2/users/get_current_account";
            const response = await axios.post(url, JSON.stringify(null), {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                }
            });

            const user = {
                username: response.data.name.display_name,
                email: response.data.email
            };
            return user;
        } catch (err) {
            console.log(err);
        }
    }
}
