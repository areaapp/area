'use strict'

module.exports = {
    dropbox: {
        actions: [],
        reactions: []
    },
    github: {
        actions: [],
        reactions: []
    },
    google: {
        actions: [{
            name: 'google_gmail_new_mail',
            displayName: 'New email on Gmail',
            description: 'Triggered when a email is received in gmail',
            params: {
            }
        }],
        reactions: [{
            name: 'google_gmail_send_email',
            displayName: 'Send email with Gmail',
            description: 'Send email with Gmail',
            params: {
                addresses: 'Array',
                content: 'string'
            }
        }]
    },
    office: {
        actions: [],
        reactions: []
    },
    spotify: {
        actions: [],
        reactions: []
    },
    twitch: {
        actions: [],
        reactions: []
    },
};
