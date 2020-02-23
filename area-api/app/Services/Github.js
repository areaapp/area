'use strict'

const Config = use('Config');
const axios = require('axios');
const ApiInfos = Config.get('oauth.config');

module.exports = {
    authType: 'oauth',
    name: 'github',
    displayName: 'Github',
    description: 'plus tard',
    baseUrl: 'www.github.com',
    iconName: 'github-circle',
    foreground: '#ffffff',
    background: '#211f1f',
    irregularAccessToken: true,
    codeFlow: true,
    authorizeUrl: "https://github.com/login/oauth/authorize",
    accessTokenUrl: 'https://github.com/login/oauth/access_token',
    scopeSeparator: '%20',
    scopes: [
        'user'
    ],

    async getAccessToken(oauthHelper, code, clientType) {
        const oauthService = oauthHelper.getService(clientType,this.name);
        const data = {
            client_id: oauthService.client_id,
            client_secret: oauthService.client_secret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: oauthService.redirect_uri
        };

        try {
            const response = await axios.post(this.accessTokenUrl, data, {
                headers: {'Accept': 'application/json'}
            });
            return response.data.access_token;
        } catch (err) {
            console.log(err);
            return null;
        }
    },

    async getUser(access_token) {
        const url = "https://api.github.com/user";

        try {
            const response = await axios.get(url, {
                headers: {'Authorization': 'token ' + access_token}
            });

            const email = await this.getEmail(access_token);
            response.data.email = email.email;

            return {
                username: response.data.login,
                email: response.data.email,
            };
        } catch (err) {
            console.log(err);
            return null;
        }
    },

    async getEmail(access_token) {
        const emailUrl = "https://api.github.com/user/emails";
        const emailResponse = await axios.get(emailUrl, {
            headers: {'Authorization': 'Bearer ' + access_token}
        });

        return emailResponse.data.find(email => email.verified && email.primary);
    }
};
