'use strict'

const axios = require('axios');
const querystring = require('querystring');
const ApiInfos = require('../../oauth.config.js');

module.exports = {
    authType: 'oauth',
    name: 'Github',
    description: 'plus tard',
    baseUrl: 'www.github.com',
    authorizeUrl: "https://github.com/login/oauth/authorize",
    accessTokenUrl: 'https://github.com/login/oauth/access_token',
    scopeSeparator: '%20',
    scopes: [
        'user'
    ],

    getAuthorizeUrl(clientType) {
        const scopes = 'scope=' + this.scopes.join(this.scopeSeparator);
        const client_id = 'client_id=' + ApiInfos[clientType].github.client_id;
        const redirect_uri = 'redirect_uri=' + ApiInfos[clientType].github.redirect_uri;
        const url = this.authorizeUrl + '?' + [scopes, client_id, redirect_uri].join('&');
        return url;
    },

    async getAccessToken({ code, clientType }) {
        const data = querystring.stringify({
            client_id: ApiInfos[clientType].github.client_id,
            client_secret: ApiInfos[clientType].github.client_secret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: ApiInfos[clientType].github.redirect_uri
        });

        try {
            const response = await axios.post(this.accessTokenUrl,data);
            return response.data.access_token;
        } catch (err) {
            console.log(err);
        }
    },

    async getUser(access_token) {
        const url = "https://api.github.com/user";
        const response = await axios.get(url, {
            headers: {'Authorization': 'token ' + access_token}
        });

        const email = await this.getEmail(access_token);
        response.data.email = email.email;

        const user = {
            username: response.data.login,
            email: response.data.email,
        }

        return user;
    },

    async getEmail(access_token) {
        const emailUrl = "https://api.github.com/user/emails";
        const emailResponse = await axios.get(emailUrl, {
            headers: {'Authorization': 'token ' + access_token}
        });

        return emailResponse.data.find(email => email.verified && email.primary);
    }
};
