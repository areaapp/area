'use strict'

const axios = require('axios');
const querystring = require('querystring');
const ApiInfos = require('../../oauth.config.js');

module.exports = {
    authType: 'oauth',
    name: 'Twitch',
    description: '',
    baseUrl: 'https://twitch.tv/',
    authorizeUrl: 'https://id.twitch.tv/oauth2/authorize?response_type=code',
    accessTokenUrl: 'https://id.twitch.tv/oauth2/token',
    scopeSeparator: '+',
    scopes: [
        'user:read:email'
    ],

    getAuthorizeUrl(clientType) {
        const scopes = 'scope=' + this.scopes.join(this.scopeSeparator);
        const client_id = 'client_id=' + ApiInfos[clientType].twitch.client_id;
        const redirect_uri = 'redirect_uri=' + ApiInfos[clientType].twitch.redirect_uri;
        const response_type = 'response_type=code';
        const url = this.authorizeUrl + '?' + [scopes, client_id, redirect_uri, response_type].join('&');
        return url;
    },

    async getAccessToken({ code, clientType }) {
        const data = querystring.stringify({
            client_id: ApiInfos[clientType].twitch.client_id,
            client_secret: ApiInfos[clientType].twitch.client_secret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: ApiInfos[clientType].twitch.redirect_uri
        });

        try {
            const response = await axios.post(this.accessTokenUrl,data);
            return response.data.access_token;
        } catch (err) {
            console.log(err);
        }
    },

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
