'use strict'

module.exports = {
    web: {
        github: {
            client_id: '218972d16bd648424b78',
            client_secret: '00bbbaa601871fa54a0ed39ced00b6a6fc5b3169',
            redirect_uri: 'http://localhost:3000/auth/oauth/github/callback'
        },
        google: {
            client_id: '940097047883-9hos8tpf9gsn2pucktvc98l8rgfdr3ht.apps.googleusercontent.com',
            client_secret: 'lDYoBNZOlZ9Dva4R4msqeOyk',
            redirect_uri: 'http://localhost:3000/auth/oauth/google/callback'
        },
        office: {
            client_id: '5ba4dcd1-3338-4896-b2b4-a3253ab044b8',
            client_secret: 'IshS0rfrvKzpHExPPW3aMy7Z@jI.v_-0',
            redirect_uri: 'http://localhost:3000/auth/oauth/office/callback'
        },
        twitch: {
            client_id: 'smm2hzu9tfazz1c83my2pfvm859cim',
            client_secret: '3roms3nf98f0xnkmxhzmhfmg6e4rc9',
            redirect_uri: 'http://localhost:3000/auth/oauth/twitch/callback'
        },
        dropbox: {
            client_id: 'g7mmh6rxdwvughb',
            client_secret: 'yazpg66z6gaxome',
            redirect_uri: 'http://localhost:3000/auth/oauth/dropbox/callback'
        },
        spotify: {
            client_id: 'ec2600463a664ce5a7ed5b9861e8ecfa',
            client_secret: 'e06c2ba9269d4f018ff616af65350155',
            redirect_uri: 'http://localhost:3000/auth/oauth/spotify/callback'
        },
    },

    android: {
        github: {
            client_id: '1216cb3b7eaa4c4fc208',
            client_secret: 'e631d3548508f9a7b19f41c647b905d3613a25c2',
            redirect_uri: 'area-android://auth/github'
        },
        twitch: {
            client_id: 'qmuagfy1fh2vx5fay1ekf6e17scrye',
            client_secret: 'wkzlsel2r7uldsmi4hds52qmbkq8e3',
            redirect_uri: 'area-android://auth/twitch'
        },
        dropbox: {
            client_id: 'rloqxt3qhdnqeyf',
            client_secret: 'xr7rz8e8wyqc9yk',
            redirect_uri: ''
        },
        spotify: {
            client_id: '45335b4169014a4ab5375d21707fbdb4',
            client_secret: '1ee2c54d5a094b6f8a431e68acc5db13',
            redirect_uri: 'area-android://auth/spotify'
        },
        office: {
            client_id: '267ebe42-ef2d-46e2-933e-956b72977c7d',
            client_secret: 'H9d@vrRklkspaVQBK3=5_IMABGq4nBL/',
            redirect_uri: 'area-android://auth/office'
        },
        google: {
            client_id: '414833544494-3mp46u11g0k3d1hn13nbmu27b85uvuea.apps.googleusercontent.com',
            client_secret: '',
            redirect_uri: 'area-android://auth/office'
        }
    },
}
