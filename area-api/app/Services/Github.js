'use strict'

const Env = use('Env');
const axios = require('axios');

module.exports = {
     authType: 'oauth',
     name: 'Github',
     description: 'plus tard',
     baseUrl: 'www.github.com',
     authorizeUrl: "https://github.com/login/oauth/authorize?scope=user&client_id=",
     accessTokenUrl: 'https://github.com/login/oauth/access_token',

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
