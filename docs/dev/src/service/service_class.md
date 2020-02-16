# Service class

Now, you can add the properties of the new service.
Create a file in `area-api/app/Services/` called as your service, and it in `area-api/app/Services/index.js`.
Your new file must export an object containing the following keys:

Name | Type | Description
--- | --- | ---
authType | String | Type of authentication. Only `oauth` is accepted for now
name | String | Name of the service. In only lowercase letters and underscores accepted, no space or digits.
displayName | String | Name of the service that will be displayed
description | String | Description of the service
baseUrl | String | Base url of the service
iconName | String | Icon name representing the service. Can be found [here](https://materialdesignicons.com/)
foreground | String | Foreground color of the service, in hexadecimal
background | String | Background color of the service, in hexadecimal
irregularAccessToken | Boolean | True if the service use different arguments or a different way to get the access_token. You must implement the `getAccessToken` function if this parameter is true
codeFlow | Boolean | True if the service use the authorization code flow. If false, it will use the implicit authorization flow
authorizeUrl | String | Url where the user will be redirected to authorize the application. Cannot contains query parameters
accessTokenUrl | String | Url of the service to get the accessToken
scopeSeparator | String | Url-encoded separator of the scopes
scopes | Array | Scopes that must be authorized

Example:
```javascript
module.exports = {
    authType: 'oauth',
    name: 'github',
    displayName: 'Github',
    description: 'plus tard',
    baseUrl: 'www.github.com',
    iconName: 'github-circle',
    foreground: '#ffffff',
    background: '#211f1f',
    irregularAccessToken: true,
    codeFlow: true,
    authorizeUrl: "https://github.com/login/oauth/authorize",
    accessTokenUrl: 'https://github.com/login/oauth/access_token',
    scopeSeparator: '%20',
    scopes: [
        'user'
    ],

    ...

}
```

Then, you have to add the `getUser` method. Here is the prototype:
```javascript
async getUser(accessToken)
```

This function must return an object with the `username` and `email` key.

> Node: This function must return `null` if an error as occured

Example:

```javascript
const axios = require('axios');

async getUser(accessToken) {
    const url = "https://api.twitch.tv/helix/users";

    try {
        const response = await axios.get(url, {
            headers: {'Authorization': 'Bearer ' + accessToken}
        });

        return {
            username: response.data.data[0].display_name,
            email: response.data.data[0].email
        };
    } catch (err) {
        return null;
    }
}
```

If the service use a irregular way to get the access_token, you have to write the following function (only for authorization code flow):
```javascript
async getAccessToken(oauthHelper, code, clientType)
```

This function must return the access_token.

> Note: This function must return `null` if an error as occured

> Note: You can access to the oauth config by using the following function: `oauthHelper.getService(clientType, serviceName)`

Example:
```javascript
const axios = require('axios');

async getAccessToken(oauthHelper, code, clientType) {
    const oauthService = oauthHelper.getService(clientType, this.name)
    const data = {
        client_id: oauthService.client_id,
        client_secret: oauthService.client_secret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: oauthService.redirect_uri
    };

    try {
        const response = await axios.post(this.accessTokenUrl, data, {
            headers: {'Accept': 'application/json'}
        });
        return response.data.access_token;
    } catch (err) {
        return null;
    }
}
```