'use strict';

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
        actions: [
            {
                name: 'google_gmail_new_email',
                displayName: 'New email on Gmail',
                description: 'Triggered when a email is received in gmail',
                params: {
                }
            },
            {
                name: 'google_youtube_new_video',
                displayName: 'New video uploaded on a Youtube channel',
                description: 'Triggered when a video is uploaded on youtube channel',
                params: {
                    channel: 'string'
                }
            }
        ],
        reactions: [
            {
                name: 'google_gmail_send_email',
                displayName: 'Send email with Gmail',
                description: 'Send email with Gmail',
                params: {
                    to: 'string',
                    subject: 'string',
                    content: 'string'
                }
            },
            {
                name: 'google_youtube_add_to_watch_later',
                displayName: 'Add to watch later',
                description: 'Add a video to "watch later" playlist',
                params: {
                    video: 'string'
                }
            }
        ]
    },
    spotify: {
        actions: [
            {
                name: 'spotify_new_artist_song',
                displayName: 'New song',
                description: 'Triggered when a new song is added for an artist on Spotify',
                params: {
                    artist: 'string'
                }
            },
            {
                name: 'spotify_artist_appear_in_new_song',
                displayName: 'Artist appear in a new song',
                description: 'Triggered when an artist appear in a new song',
                params: {
                    artist: 'string'
                }
            }
        ],
        reactions: []
    },
    office: {
        actions: [],
        reactions: []
    },
    twitch: {
        actions: [
            {
                name: 'twitch_streamer_connected',
                displayName: 'Streamer connected',
                description: 'Triggered when a streamer is connected',
                params: {
                    streamer: 'string'
                }
            },
            {
                name: 'twitch_game_has_x_viewers',
                displayName: 'Game has X viewers',
                description: 'Triggered when a game exceeds X viewers on Twitch',
                params: {
                    game: 'string',
                    viewers: 'integer'
                }
            }
        ],
        reactions: []
    },
    gitlab: {
        actions: [],
        reactions: []
    },
    openweathermap: {
        actions: [],
        reactions: [],
    }
};
