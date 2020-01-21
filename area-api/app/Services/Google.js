'use strict'

const axios = require('axios');
const querystring = require('querystring');
const ApiInfos = require('../../oauth.config.js');

module.exports = {
    authType: 'oauth',
     name: 'Gooel',
     description: 'plus tard',
     baseUrl: 'www.google.com',
     authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    accessTokenUrl: 'https://oauth2.googleapis.com/token',
    scopeSeparator: '%20',
    scopes: [
        'profile',
        'email'
    ],

    getAuthorizeUrl(clientType) {
        const scopes = 'scope=' + this.scopes.join(this.scopeSeparator);
        const client_id = 'client_id=' + ApiInfos[clientType].google.client_id;
        const redirect_uri = 'redirect_uri=' + ApiInfos[clientType].google.redirect_uri;
        const response_type = 'response_type=code';
        const url = this.authorizeUrl + '?' + [scopes, client_id, redirect_uri, response_type].join('&');
        return url;
    },

    async getAccessToken({ code, clientType }) {
        const data = querystring.stringify({
            client_id: ApiInfos[clientType].google.client_id,
            client_secret: ApiInfos[clientType].google.client_secret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: ApiInfos[clientType].google.redirect_uri
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
            const url = "https://people.googleapis.com/v1/people/me?personFields=emailAddresses%2Cnames";
            const response = await axios.get(url, {
                headers: {'Authorization': 'Bearer ' + accessToken}
            });

            const user = {
                username: response.data.names[0].displayName,
                email: response.data.emailAddresses[0].value
            };
            return user;
        } catch (err) {
            console.log(err.message);
        }
    }
}
