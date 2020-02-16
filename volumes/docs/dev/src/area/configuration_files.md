# Configuration files

You have to add all your action and reaction models in `area-api/area.config.js`

In the coresponding service, add an object containing the following keys:

Name | Description
--- | ---
name | Name of the action/reaction. Lowercase letters and underscores only. Must be prefixed by the service name and must be unique
displayName | Name of the action/reaction that will be displayed
description | Description of the action/reaction
params | Parameters nedded by the action/reaction. It's an object where the keys are the parameters name and the values are the parameter type

Example:
```javascript
google: {
    actions: [
        {
            name: 'google_gmail_new_mail',
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
                addres: 'string',
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
}
```