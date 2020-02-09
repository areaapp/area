'use strict'

const axios = require('axios');
const querystring = require('querystring');
const ApiInfos = require('../../oauth.config.js');

module.exports = {
    authType: 'oauth',
    name: 'office',
    displayName: 'Office 365',
    decription: 'plus tard',
    baseUrl: 'www.office.com',
    iconName: 'office',
    foreground: '#dc3e15',
    background: '#ffffff',
    irregularAccessToken: false,
    codeFlow: true,
    authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    accessTokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scopeSeparator: '%20',
    scopes: [
        'User.Read'
    ],

    async getUser(accessToken) {
        const url = "https://graph.microsoft.com/v1.0/me";
        const response = await axios.get(url, {
            headers: {'Authorization': 'Bearer ' + accessToken}
        });

        console.log(response);
        const user = {
            username: response.data.displayName,
            email: response.data.mail
        };
        return user;
    }
}
