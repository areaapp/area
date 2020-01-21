'use strict'

const axios = require('axios');
const querystring = require('querystring');
const ApiInfos = require('../../oauth.config.js');

module.exports = {
    authType: 'oauth',
    name: 'Office 365',
    decription: '',
    baseUrl: '',
    authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    accessTokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scopeSeparator: '%20',
    scopes: [
        'User.Read'
    ],

    getAuthorizeUrl(clientType) {
        const scopes = 'scope=' + this.scopes.join(this.scopeSeparator);
        const client_id = 'client_id=' + ApiInfos[clientType].office.client_id;
        const redirect_uri = 'redirect_uri=' + ApiInfos[clientType].office.redirect_uri;
        const response_type = 'response_type=code';
        const url = this.authorizeUrl + '?' + [scopes, client_id, redirect_uri, response_type].join('&');
        return url;
    },

    async getAccessToken({ code, clientType }) {
        const data = querystring.stringify({
            client_id: ApiInfos[clientType].office.client_id,
            client_secret: ApiInfos[clientType].office.client_secret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: ApiInfos[clientType].office.redirect_uri
        });

        try {
            const response = await axios.post(this.accessTokenUrl,data);
            return response.data.access_token;
        } catch (err) {
            console.log(err);
        }
    },

    async getUser(accessToken) {
        const url = "https://graph.microsoft.com/v1.0/me";
        const response = await axios.get(url, {
            headers: {'Authorization': 'Bearer ' + accessToken}
        });

        const user = {
            username: response.displayName,
            email: response.mail
        };
        return user;
    }
}
