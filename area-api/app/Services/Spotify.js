'use strict'

const axios = require('axios');
const querystring = require('querystring');
const ApiInfos = require('../../oauth.config.js');

module.exports = {
    authType: 'oauth',
    name: 'Spotify',
    description: 'plus tard',
    baseUrl: 'www.spotify.com',
    authorizeUrl: "https://accounts.spotify.com/authorize",
    accessTokenUrl: 'https://accounts.spotify.com/api/token',
    scopeSeparator: '%20',
    scopes: [
        'user-read-email'
    ],

    getAuthorizeUrl(clientType) {
        const client_id = 'client_id=' + ApiInfos[clientType].spotify.client_id;
        const redirect_uri = 'redirect_uri=' + ApiInfos[clientType].spotify.redirect_uri;
        const response_type = 'response_type=code';
        const url = this.authorizeUrl + '?' + [client_id, redirect_uri, response_type].join('&');
        return url;
    },

    async getAccessToken({ code, clientType }) {
        const data = querystring.stringify({
            client_id: ApiInfos[clientType].spotify.client_id,
            client_secret: ApiInfos[clientType].spotify.client_secret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: ApiInfos[clientType].spotify.redirect_uri
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
