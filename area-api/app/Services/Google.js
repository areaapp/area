'use strict'

const axios = require('axios');

module.exports = {
    authType: 'oauth',
     name: 'Gooel',
     description: 'plus tard',
     baseUrl: 'www.google.com',
     authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:8081/auth/social/callback/google&response_type=code&scope=profile%20email&client_id=",
    accessTokenUrl: 'https://oauth2.googleapis.com/token',

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
