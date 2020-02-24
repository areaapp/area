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
                description: 'Triggered when a email is received on gmail',
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
        reactions: [
            {
                name: 'spotify_pause_music',
                displayName: 'Pause music',
                description: 'The current music is stopped',
                params: {
                    device: 'string'
                }
            }
        ]
    },
    office: {
        actions: [
            {
                name: 'office_outlook_new_email',
                displayName: 'new email on Outlook',
                description: 'Triggered when a email is received on outlook',
                params: {}
            }
        ],
        reactions: [
            {
                name: 'office_outlook_send_email',
                displayName: 'Send email with Outlook',
                description: 'Send email with Outlook',
                params: {
                    to: 'string',
                    subject: 'string',
                    content: 'string'
                }
            },
        ]
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
                name: 'twitch_new_follow',
                displayName: 'New follower',
                description: 'A streamer has a new follower',
                params: {
                    streamer: 'string',
                }
            },
            {
                name: 'twitch_new_video_of_streamer',
                displayName: 'New video of a streamer',
                description: 'A new video of a streamer is available',
                params: {
                    streamer: 'string'
                }
            },
            {
                name: 'twitch_new_video_of_game',
                displayName: 'New video of a game',
                description: 'A new video of a game is available',
                params: {
                    game: 'string'
                }
            },
            {
                name: 'twitch_new_clip_of_game',
                displayName: 'New clip of a game',
                description: 'A new clip of a game is available',
                params: {
                    game: 'string'
                }
            },
            {
                name: 'twitch_new_clip_of_streamer',
                displayName: 'New clip of a streamer',
                description: 'A new clip of a streamer is available',
                params: {
                    streamer: 'string'
                }
            }
        ],
        reactions: []
    }
};
