'use strict'

const axios = require('axios');
const querystring = require('querystring');

module.exports = {
    authType: 'oauth',
    name: 'gitlab',
    displayName: 'Gitlab',
    description: 'GitLab is a web-based DevOps lifecycle tool that provides a Git-repository manager providing wiki, issue-tracking and CI/CD pipeline features, using an open-source license, developed by GitLab Inc.',
    baseUrl: 'www.gitlab.com',
    iconName: 'gitlab',
    foreground: '#ffffff',
    background: '#7289da',
    irregularAuthorizeUrl: false,
    irregularAccessToken: false,
    codeFlow: true,
    authorizeUrl: "https://gitlab.com/oauth/authorize",
    accessTokenUrl: 'https://gitlab.com/oauth/token',
    scopeSeparator: '%20',
    scopes: [
        'profile',
        'read_user',
        'api'
    ],

    async getUser(accessToken) {
        try {
            const url = "https://gitlab.com/api/v4/user";
            const response = await axios.get(url, {
                headers: {'Authorization': 'Bearer ' + accessToken}
            });

            const user = {
                username: response.data.username,
                email: response.data.email
            };
            return user;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}
