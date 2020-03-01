# Action/Reaction logic

Once the actions/reactions are added to the configuration file, you have to write their logic in the `area-executor` folder.

### Create folders and files

First, if it does not exists, create the corresponding service folder in `src/services`, and create the following files:

`src/services/serviceName/actions.js`:
```javascript
export default {

};
```

`src/services/serviceName/reactions.js`:
```javascript
export default {

};
```

`src/services/serviceName/index.js`:
```javascript
export default {
    actions: require('./actions.js'),
    reactions: require('./reactions.js'),
};
```


Finally, add your service in `src/services/index.js`:
Example:
```javascript
export default {
    github: require('./github'),
    google: require('./google'),
    twitch: require('./twitch'),
    office: require('./office'),
    spotify: require('./spotify'),
    dropbox: require('./dropbox'),
    gitlab: require('./gitlab'),
    openweathermap: require('./openweathermap'),
    MyNewService: require('./mynewservice')
};
```


### Add an action

Once the files are created, you can add your actions and reactions in their respective files.

To add and action, create a new asynchronous function in the `actions.js` file, here is the prototype:
```javascript
async my_action_name(area, reaction, ctx);
```

Name | Description
--- | ---
my_service_name | The function name must be the name of the action added in `area-api/config/area.config.js`
area | The area that will be executed. Contains all informations about the user, the action (params and buffer), and the reaction (params)
reaction | This is a function representing the reaction. Must be call to execute the reaction.
ctx | The context. Contains usefull methods like `ctx.db.updateBuffer`, `ctx.db.updateLastExecution` or `ctx.notifier.notifie`

Example:
```javascript
async google_gmail_new_email(area, reaction, ctx) {
    const email = area.user.email;
    const route = `https://www.googleapis.com/gmail/v1/users/me/messages?q=is:unread`;
    const { data } = await ctx._axios.get(route, {
        headers: {
            Authorization: `Bearer ${area.action.service.oauth_token}`
        }
    });


    if (!data.messages || !data.messages.length) {
        return;
    }

    if (area.action.buffer) {
        if (area.action.buffer !== data.messages[0].id) {
            await reaction(area, ctx);
        }
    }
    ctx.db.updateBuffer(area.action.id, data.messages[0].id);
}
```


In the actions, the following function can be used to update the action buffer:
```javascript
ctx.db.updateBuffer(actionId, bufferContent);
```


If the action is triggered, you have to call the reaction function:
```javascript
await reaction(area, ctx);
```


### Add a reaction

To add a reaction, create an asynchronous function like we did for adding an action, but remove the `reaction` parameter.
Example:
```javascript
async google_gmail_send_email(area, ctx)
```

In the reactions, the following function can be used to update the last execution of the area (only if the execution is successful):
```javascript
ctx.db.updateLastExecution(area.id);
```

You also have to notifie the user about the execution:
```javascript
ctx.notifier.notifie(area.user.id, `${area.name} executed successfully`);
```

Example:
```javascript
async github_add_reaction_issue_comment(area, ctx) {
    const args = area.reaction.args;
    const url = `https://api.github.com/repos/${args.owner}/${args.repo}/issues/comments/${args.commentId}/reactions`;

    await ctx._axios.post(url, {
        content: args.reaction
    }, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/vnd.github.squirrel-girl-preview+json',
            Authorization: `token ${area.reaction.service.oauth_token}`
        }
    });
    ctx.db.updateLastExecution(area.id);
    ctx.notifier.notifie(area.user.id, `${area.name} executed successfully`);
}
```
