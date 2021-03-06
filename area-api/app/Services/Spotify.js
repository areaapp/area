'use strict'

const axios = require('axios');
const querystring = require('querystring');

module.exports = {
    authType: 'oauth',
    name: 'spotify',
    displayName: 'Spotify',
    description: 'Spotify is a digital music, podcast, and video streaming service that gives you access to millions of songs and other content from artists all over the world. Basic functions such as playing music are totally free, but you can also choose to upgrade to Spotify Premium.',
    baseUrl: 'www.spotify.com',
    iconName: 'spotify',
    foreground: '#ffffff',
    background: '#1ed761',
    irregularAuthorizeUrl: false,
    irregularAccessToken: false,
    codeFlow: true,
    authorizeUrl: "https://accounts.spotify.com/authorize",
    accessTokenUrl: 'https://accounts.spotify.com/api/token',
    scopeSeparator: '%20',
    scopes: [
        'user-read-email',
        'user-read-playback-state',
        'user-modify-playback-state',
    ],

    async getUser(accessToken) {
        try {
            const url = "https://api.spotify.com/v1/me";
            const response = await axios.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                }
            });

            const user = {
                username: response.data.display_name,
                email: response.data.email
            };
            return user;
        } catch (err) {
            console.log(err);
        }
    }
}
