define({ "api": [
  {
    "type": "post",
    "url": "/auth/oauth/signin/:service",
    "title": "Signup/Signin a user with a oauth service",
    "name": "ServiceSignin",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "service",
            "description": "<p>Service used to authenticate</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "authCode",
            "description": "<p>OAuth code got from authorize url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "clientType",
            "description": "<p>Type of client making the call. Can be 'web' or 'android'</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Token type</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>Refresh token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/2 200 OK\n{\n  \"type\": \"bearer\",\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE4LCJpYXQiOjE1NzI3MTU5ODJ9.L3oN-1dy9CiV2Uijaq8tAhuJ4Y4Sxlxs2dnaOg9ZWYA\",\n  \"refreshToken\": null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "start/routes.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/signin",
    "title": "Signin a user using basic authentication",
    "name": "Signin",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Token type</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>Refresh token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/2 200 OK\n{\n  \"type\": \"bearer\",\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE4LCJpYXQiOjE1NzI3MTU5ODJ9.L3oN-1dy9CiV2Uijaq8tAhuJ4Y4Sxlxs2dnaOg9ZWYA\",\n  \"refreshToken\": null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "start/routes.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/auth/signup",
    "title": "Signup a user using basic authentication",
    "name": "Signup",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>password</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "email",
            "description": "<p>email</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Token type</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "token",
            "description": "<p>JWT token</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "refreshToken",
            "description": "<p>Refresh token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/2 200 OK\n{\n  \"type\": \"bearer\",\n  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE4LCJpYXQiOjE1NzI3MTU5ODJ9.L3oN-1dy9CiV2Uijaq8tAhuJ4Y4Sxlxs2dnaOg9ZWYA\",\n  \"refreshToken\": null\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "start/routes.js",
    "groupTitle": "Auth"
  },
  {
    "type": "get",
    "url": "/auth/oauth/authorize_url/:service/:clientType",
    "title": "Get authorization url for a service",
    "name": "authorize_url",
    "group": "Auth",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "service",
            "description": "<p>Service name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "clientType",
            "description": "<p>Type of client making the call. Can be 'web' or 'android'</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "authorize_url",
            "description": "<p>Url where to redirect the client</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/2 200 OK\n{\n  \"https://www.dropbox.com/oauth2/authorize?client_id=00000&redirect_uri=http://localhost:8081/callback&response_type=code\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "start/routes.js",
    "groupTitle": "Auth"
  },
  {
    "type": "post",
    "url": "/me/services/:name",
    "title": "Create a service instance for this user",
    "name": "Service",
    "group": "User",
    "header": {
      "fields": {
        "Header": [
          {
            "group": "Header",
            "type": "String",
            "optional": false,
            "field": "authorization",
            "description": "<p>Bearer &lt;token&gt;</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the service</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "authCode",
            "description": "<p>OAuth code got from authorize url</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "clientType",
            "description": "<p>Type of client making the call. Can be 'web' or 'android'</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "start/routes.js",
    "groupTitle": "User"
  }
] });
