'use strict'

const axios = require('axios');
const querystring = require('querystring');
const ApiInfos = require('../../oauth.config.js');

module.exports = {
    authType: 'oauth',
    name: 'google',
    displayName: 'Google',
    description: 'plus tard',
    baseUrl: 'www.google.com',
    iconName: 'google',
    foreground: '',
    background: '',
    irregularAccessToken: false,
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    accessTokenUrl: 'https://oauth2.googleapis.com/token',
    scopeSeparator: '%20',
    scopes: [
        'profile',
        'email'
    ],

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
