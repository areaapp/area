# Configuration files

### Oauth configuration

First create your application in the service you want to add.
You can find a list of possible services [here](https://en.wikipedia.org/wiki/List_of_OAuth_providers).
Once you created your application, add your service in `area-api/oauth.config.js`, inside both the `web` and the `android` objects.
Add the following informations:

Name | Description
--- | ---
client_id     | The client id received when creating the application in the service
client_secret | The client secret received when creating the application in the service
redirect_uri  | The uri where users are sent after authorization. This must match exactly the redirect uri that you entered in the service application. <br><br>Inside the web object, the url must match the following syntax: `http://host:port/auth/oauth/serviceName/callback`<br>Inside the android object, the url must match the following syntax: `area-android://auth/serviceName`

Example:
```javascript
web: {
     ...
     github: {
        client_id: '********************',
        client_secret: '****************************************',
        redirect_uri: 'http://localhost:3000/auth/oauth/github/callback'
    }
},
android: {
     ...
     github: {
        client_id: '********************',
        client_secret: '****************************************',
        redirect_uri: 'area-android://auth/github'
     }
}
```
> Note: Some services do not handle multiple redirect uri. In that case, you can create two application, one for the web client, an the other for the android application.

> Warning: Some services do not ask for a redirect uri for an mobile application. In that case, you have to search in the service documentation where the service redirect the user after authorization. For those services, you also have to modify the android application itself.

### Area configuration

One you added your new service in the oauth config file, you have to had it in the area config, to list the actions and reactions models of this service.

In `area-api/area.config.js`, juste add your service as a new object, containing two keys: `actions` and `reactions`, that are both arrays.

Example:
```javascript
module.exports = {
    ...
    github: {
        actions: [],
        reactions: []
    }
}
```