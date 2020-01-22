'use strict'

const axios = require('axios');
const querystring = require('querystring');
const ApiInfos = require('../../oauth.config.js');

module.exports = {
    authType: 'oauth',
    name: 'Dropbox',
    description: 'plus tard',
    baseUrl: 'www.dropbox.com',
    authorizeUrl: "https://www.dropbox.com/oauth2/authorize",
    accessTokenUrl: 'https://api.dropboxapi.com/oauth2/token',
    scopeSeparator: '%20',
    scopes: [
    ],

    getAuthorizeUrl(clientType) {
        const client_id = 'client_id=' + ApiInfos[clientType].dropbox.client_id;
        const redirect_uri = 'redirect_uri=' + ApiInfos[clientType].dropbox.redirect_uri;
        const response_type = 'response_type=code';
        const url = this.authorizeUrl + '?' + [client_id, redirect_uri, response_type].join('&');
        return url;
    },

    async getAccessToken({ code, clientType }) {
        const data = querystring.stringify({
            client_id: ApiInfos[clientType].dropbox.client_id,
            client_secret: ApiInfos[clientType].dropbox.client_secret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: ApiInfos[clientType].dropbox.redirect_uri
        });

        try {
            const response = await axios.post(this.accessTokenUrl,data);
            return response.data.access_token;
        } catch (err) {
            console.log(err);
        }
    },

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
