'use strict'

const axios = require('axios');

module.exports = {
    authType: 'oauth',
    name: 'Office 365',
    decription: '',
    baseUrl: '',
    authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?scope=User.Read&client_id=',
    accessTokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',

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
