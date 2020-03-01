'use strict'

const axios = require('axios');
const querystring = require('querystring');

module.exports = {
    authType: 'oauth',
    name: 'office',
    displayName: 'Office 365',
    description: 'Microsoft Office 365 is a Software as a Service (SaaS) solution that includes Microsoft Office and other services, such as email and collaboration, from Microsoft\'s cloud server. Microsoft Office 365 provides desktop functionalities and is available by subscription.',
    baseUrl: 'www.office.com',
    iconName: 'office',
    foreground: '#ffffff',
    background: '#D04423',
    irregularAuthorizeUrl: false,
    irregularAccessToken: false,
    codeFlow: true,
    authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    accessTokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scopeSeparator: '%20',
    scopes: [
        'User.Read',
        'mail.read',
        'mail.send',
        'Mail.ReadWrite'
    ],

    async getUser(accessToken) {
        const url = "https://graph.microsoft.com/v1.0/me";
        const response = await axios.get(url, {
            headers: {'Authorization': 'Bearer ' + accessToken}
        });

        const user = {
            username: response.data.displayName,
            email: response.data.mail
        };
        return user;
    }
}
