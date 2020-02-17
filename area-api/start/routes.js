'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');
const User = use('App/Models/User');
const Service = use('App/Models/Service');
const axios = require('axios');

Route.group(() => {
    /**
     * @api {post} /auth/signup Signup a user using basic authentication
     * @apiName Signup
     * @apiGroup Auth
     * @apiParam {String} username username
     * @apiParam {String} password password
     * @apiParam {String} email email
     *
     * @apiSuccess {String} type Token type
     * @apiSuccess {String} token JWT token
     * @apiSuccess {String} refreshToken Refresh token
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "type": "bearer",
     *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE4LCJpYXQiOjE1NzI3MTU5ODJ9.L3oN-1dy9CiV2Uijaq8tAhuJ4Y4Sxlxs2dnaOg9ZWYA",
     *       "refreshToken": null
     *     }
     */
    Route.post('signup', 'Auth/AuthController.signup');

    /**
     * @api {post} /auth/signin Signin a user using basic authentication
     * @apiName Signin
     * @apiGroup Auth
     * @apiGroup Auth
     * @apiParam {String} password password
     * @apiParam {String} email email
     *
     * @apiSuccess {String} type Token type
     * @apiSuccess {String} token JWT token
     * @apiSuccess {String} refreshToken Refresh token
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "type": "bearer",
     *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE4LCJpYXQiOjE1NzI3MTU5ODJ9.L3oN-1dy9CiV2Uijaq8tAhuJ4Y4Sxlxs2dnaOg9ZWYA",
     *       "refreshToken": null
     *     }
     */
    Route.post('signin', 'Auth/AuthController.signin');


    /**
     * @api {post} /auth/oauth/signin Signup/Signin a user with a oauth service
     * @apiName ServiceSignin
     * @apiGroup Auth
     * @apiParam {String} service Service used to authenticate
     * @apiParam {String} authCode OAuth code got from authorize url
     * @apiParam {String} clientType Type of client making the call. Can be 'web' or 'android'
     *
     * @apiSuccess {String} type Token type
     * @apiSuccess {String} token JWT token
     * @apiSuccess {String} refreshToken Refresh token
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "type": "bearer",
     *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjE4LCJpYXQiOjE1NzI3MTU5ODJ9.L3oN-1dy9CiV2Uijaq8tAhuJ4Y4Sxlxs2dnaOg9ZWYA",
     *       "refreshToken": null
     *     }
     */
    Route.post('oauth/signin', 'Auth/OAuthController.signin').middleware('oauth');


    /**
     * @api {get} /auth/oauth/authorize_url/:service/:clientType Get authorization url for a service
     * @apiName authorize_url
     * @apiGroup Auth
     * @apiParam {String} service Service name
     * @apiParam {String} clientType Type of client making the call. Can be 'web' or 'android'
     *
     * @apiSuccess {String} authorize_url Url where to redirect the client
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "https://www.dropbox.com/oauth2/authorize?client_id=00000&redirect_uri=http://localhost:8081/callback&response_type=code"
     *     }
     */
    Route.get('oauth/authorize_url/:serviceName/:clientType', 'Auth/OAuthController.getAuthorizeUrl').middleware('oauth');
}).prefix('auth');

Route.group(() => {

    /**
     * @api {post} /me/services/:name Add a service instance
     * @apiName AddService
     * @apiGroup User
     * @apiHeader {String} authorization Bearer \<token\>
     * @apiParam {String} name Name of the service
     * @apiParam {String} authCode OAuth code got from authorize url
     * @apiParam {String} clientType Type of client making the call. Can be 'web' or 'android'
     * @apiSuccess {String} username Username of the user
     * @apiSuccess {String} email Email of the user
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *        {
     *          "name": "google",
     *          "email": "kylian.maugue@epitech.eu"
     *        }
     */
    Route.post('services/:serviceName([a-zA-Z]+)', 'User/UserServiceController.addService').middleware(['auth', 'oauth']);

    /**
     * @api {get} /me Get current user
     * @apiName GetUser
     * @apiGroup User
     * @apiSuccess {String} username Username of the user
     * @apiSuccess {String} email Email of the user
     * @apiSuccess {String} register_source Source of the register (can be a service name or 'area')
     * @apiSuccess {String} avatar Md5 hash of the user's email (used for the avatar)
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *        {
     *          "username": "kylianm",
     *          "email": "kylian.maugue@epitech.eu"
     *          "register_source": "area"
     *          "avatar": "9cb9af3a4d2894dd0b75a2d56bb5f70a"
     *        }
     */
    Route.get('/', 'User/UserController.getUser').middleware('auth');

    /**
     * @api {put} /me Modify infos of username
     * @apiName ModifyUser
     * @apiGroup User
     * @apiParam {String} password New password
     * @apiSuccess {String} username New username
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *        {
     *          "username": "jlemoine",
     *          "email" : "jonathan.lemoine@epitech.eu",
     *          "register_source": "github",
     *          "avatar": "c502f2cbaf600e20ca5028ffac157742"
     *        }
     */
    Route.put('/', 'User/UserController.setUserInfos').middleware('auth');

    /**
     * @api {get} /me/services Get user services
     * @apiName GetUserServices
     * @apiGroup User
     * @apiSuccess {String} name Name of the service
     * @apiSuccess {String} email Email used to connect to the service
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *        {
     *          "google": {
     *            "name": "google",
     *            "email": "kylianm@tek.eu"
     *          }
     *        }
     */
    Route.get('/services', 'User/UserServiceController.getUserServices').middleware('auth');

    /**
     * @api {delete} /me/services/:name Delete a user service
     * @apiName DeleteUserService
     * @apiGroup User
     * @apiParam {String} name Name of the service to delete
     * @apiSuccess {String} name Name of the service
     * @apiSuccess {String} email Email used to connect to the service
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "google": {
     *         "name": "google",
     *         "email": "kylianm@tek.eu"
     *       }
     *     }
     */
    Route.delete('/services/:name([a-zA-Z]+)', 'User/UserServiceController.deleteService').middleware('auth');

    /**
     * @api {post} /me/area Add an area
     * @apiName Area
     * @apiGroup User
     * @apiParam {String} name Name of the AREA
     * @apiParam {String} action Action object
     * @apiParam {String} Reaction Reaction object
     * @apiParamExample {json} Request-Example:
     *     {
     *       "name": "My Area",
     *       "action": {
     *         "name": "twitch_streamer_connected",
     *         "params": {
     *           "streamer": "mistermv"
     *          }
     *        },
     *        "reaction": {
     *          "name": "google_youtube_add_to_watch_later",
     *          "params": {
     *            "video": "https://www.youtube.com/watch?v=fsmKwdVOJFY"
     *          }
     *        }
     *      }
     * @apiSuccess {Integer} id Id of the area
     * @apiSuccess {String} name Name of the area
     * @apiSuccess {Integer} user_id Id of the area's user
     * @apiSuccess {Date} last_execution Date of the last execution
     * @apiSuccess {Object} action Object action link to the area
     * @apiSuccess {Object} reaction Object reaction link to the area
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "id": 1,
     *       "name": "My Area",
     *       "last_execution": null,
     *       "action": {
     *         "name": "twitch_streamer_connected",
     *         "args": {
     *           "streamer": "mistermv"
     *         }
     *       },
     *       "reaction": {
     *         "name": "google_youtube_add_to_watch_later",
     *         "args": {
     *           "video": "https://www.youtube.com/watch?v=fsmKwdVOJFY"
     *         }
     *       }
     *     }
     */
    Route.post('/area', 'AreaController.addArea').middleware('auth').middleware('area');

    /**
     * @api {get} /me/areas Get user areas
     * @apiName GetUserAreas
     * @apiGroup User
     * @apiSuccess {Integer} id Id of the area
     * @apiSuccess {String} name Name of the area
     * @apiSuccess {Integer} user_id Id of the area's user
     * @apiSuccess {Date} last_execution Date of the last execution
     * @apiSuccess {Object} action Object action link to the area
     * @apiSuccess {Object} reaction Object reaction link to the area
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     [
     *       {
     *         "id": 1,
     *         "name": "My Area",
     *         "last_execution": null,
     *         "action": {
     *           "name": "twitch_streamer_connected",
     *           "args": {
     *             "streamer": "mistermv"
     *           }
     *         },
     *         "reaction": {
     *           "name": "google_youtube_add_to_watch_later",
     *           "args": {
     *             "video": "https://www.youtube.com/watch?v=fsmKwdVOJFY"
     *           }
     *         }
     *       }
     *     ]
     */
    Route.get('/areas', 'AreaController.getAreas').middleware('auth').middleware('area');

    /**
     * @api {get} /me/area Get user area by id
     * @apiName GetUserArea
     * @apiGroup User
     * @apiSuccess {Integer} id Id of the area
     * @apiSuccess {String} name Name of the area
     * @apiSuccess {Integer} user_id Id of the area's user
     * @apiSuccess {Date} last_execution Date of the last execution
     * @apiSuccess {Object} action Object action link to the area
     * @apiSuccess {Object} reaction Object reaction link to the area
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *       {
     *         "id": 1,
     *         "name": "My Area",
     *         "last_execution": null,
     *         "action": {
     *           "name": "twitch_streamer_connected",
     *           "args": {
     *             "streamer": "mistermv"
     *           }
     *         },
     *         "reaction": {
     *           "name": "google_youtube_add_to_watch_later",
     *           "args": {
     *             "video": "https://www.youtube.com/watch?v=fsmKwdVOJFY"
     *           }
     *         }
     *       }
     */
    Route.get('/area/:id(\\d+)', 'AreaController.getArea').middleware('auth').middleware('area');

    /**
     * @api {delete} /me/area/:id Delete a user area
     * @apiName DeleteUserArea
     * @apiGroup User
     * @apiParam {Integer} id Id of the AREA to suppress
     * @apiSuccess {Integer} id Id of the area
     * @apiSuccess {String} name Name of the area
     * @apiSuccess {Integer} user_id Id of the area's user
     * @apiSuccess {Date} last_execution Date of the last execution
     * @apiSuccess {Object} action Object action link to the area
     * @apiSuccess {Object} reaction Object reaction link to the area
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *       {
     *         "id": 1,
     *         "name": "My Area",
     *         "last_execution": null,
     *         "action": {
     *           "name": "twitch_streamer_connected",
     *           "args": {
     *             "streamer": "mistermv"
     *           }
     *         },
     *         "reaction": {
     *           "name": "google_youtube_add_to_watch_later",
     *           "args": {
     *             "video": "https://www.youtube.com/watch?v=fsmKwdVOJFY"
     *           }
     *         }
     *       }
     */
    Route.delete('/area/:id(\\d+)', 'AreaController.deleteArea').middleware('auth').middleware('area');

    /**
     * @api {put} /me/area/:id Modify a user area
     * @apiName ModifyUserArea
     * @apiGroup User
     * @apiParam {String} name New name of the area
     * @apiParam {Date} last_execution Date of the last execution
     * @apiParam {Json} action_args Arguments of the action link to the area
     * @apiParam {String} reaction_args Arguments of the reaction link to the area
     * @apiSuccess {Integer} id Id of the area
     * @apiSuccess {String} name Name of the area
     * @apiSuccess {Integer} user_id Id of the area's user
     * @apiSuccess {Date} last_execution Date of the last execution
     * @apiSuccess {Object} action Object action link to the area
     * @apiSuccess {Object} reaction Object reaction link to the area
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *       {
     *         "id": 1,
     *         "name": "My Area",
     *         "last_execution": null,
     *         "action": {
     *           "name": "twitch_streamer_connected",
     *           "args": {
     *             "streamer": "mistermv"
     *           }
     *         },
     *         "reaction": {
     *           "name": "google_youtube_add_to_watch_later",
     *           "args": {
     *             "video": "https://www.youtube.com/watch?v=fsmKwdVOJFY"
     *           }
     *         }
     *       }
     */
    Route.put('/area/:id(\\d+)', 'AreaController.modifyArea').middleware('auth').middleware('area');

    /**
     * @api {get} /me/notifications Get user notifications
     * @apiName GetUserNotifications
     * @apiGroup User
     * @apiSuccess {Integer} user_id Id of the user
     * @apiSuccess {String} message Message of the notification
     * @apiSuccess {Boolean} readed Status of the notification (readed or not)
     * @apiSuccess {Date}   created_at Date of the notfication's creation
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "user_id": 1,
     *       "message": "Nouveau mail",
     *       "readed": false,
     *       "created_at": "2020-02-09 00:00:00"
     *     }
     */
    Route.get('/notifications', 'NotificationController.getNotifications').middleware('auth');

    /**
     * @api {put} /me/notification/:id Modify readed property of a notification
     * @apiName ModifyUserNotification
     * @apiGroup User
     * @apiParams {Boolean} readed Status of the notification (readed or not)
     * @apiSuccess {Integer} user_id Id of the user
     * @apiSuccess {String} message Message of the notification
     * @apiSuccess {Boolean} readed Status of the notification (readed or not)
     * @apiSuccess {Date}   created_at Date of the notfication's creation
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "user_id": 1,
     *       "message": "Nouveau mail",
     *       "readed": false,
     *       "created_at": "2020-02-09 00:00:00"
     *     }
     */
    Route.put('/notification/:id(\\d+)', 'NotificationController.modifyNotification').middleware('auth');

    /**
     * @api {delete} /me/notification/id Delete user notification
     * @apiName DeleteUserNotification
     * @apiGroup User
     * @apiSuccess {Integer} id Id of the notification suppressed
     * @apiSuccess {Integer} user_id Id of the user
     * @apiSuccess {String} message Message of the notification
     * @apiSuccess {Boolean} readed Status of the notification (readed or not)
     * @apiSuccess {Date}   created_at Date of the notfication's creation
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "id": "1"
     *       user_id": 1,
     *       "message": "Nouveau mail",
     *       "readed": false,
     *       "created_at": "2020-02-09 00:00:00"
     *     }
     */
    Route.delete('/notification/:id(\\d+)', 'NotificationController.deleteNotification').middleware('auth');
}).prefix('me');

Route.group(() => {

    /**
     * @api {get} /services Get all services models
     * @apiName getServices
     * @apiGroup Service
     * @apiSuccess {String} authType Type of authentication used by the service
     * @apiSuccess {String} name Name of the service to send to the server
     * @apiSuccess {String} displayName Name to display
     * @apiSuccess {String} Description Description of the service
     * @apiSuccess {String} baseUrl Url of the service
     * @apiSuccess {String} iconName Name of the icon representing the service
     * @apiSuccess {String} foreground Foreground color associated to the service
     * @apiSuccess {String} background Background color associated to the service
     * @apiSuccess {Array} actions Actions associated with this service
     * @apiSuccess {Array} reactions Reactions associated with this service
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       [
     *         {
     *           "authType": "oauth",
     *           "name": "github",
     *           "displayName": "Github",
     *           "description": "plus tard",
     *           "baseUrl": "www.github.com",
     *           "iconName": "github-circle",
     *           "foreground": "",
     *           "background": ""
     *         },
     *         {
     *           "authType": "oauth",
     *           "name": "google",
     *           "displayName": "Google",
     *           "description": "plus tard",
     *           "baseUrl": "www.google.com",
     *           "iconName": "google",
     *           "foreground": "",
     *           "background": "",
     *           "actions": [{
     *             "name": "google_gmail_new_mail",
     *             "displayName": "New email on Gmail",
     *             "description": "Triggered when a email is received in gmail",
     *             "params": {}
     *           }],
     *           "reactions": [{
     *             "name": "google_gmail_send_email",
     *             "displayName": "Send email with Gmail",
     *             "description": "Send email with Gmail",
     *             "params": {
     *               "addresses": "Array",
     *               "content": "string"
     *             }
     *           }]
     *         }
     *       ]
     *     }
     */
    Route.get('/', 'ServiceController.getServices').middleware('area');

    /**
     * @api {get} /services/:name Get a specific service model
     * @apiName getService
     * @apiGroup Service
     * @apiSuccess {String} authType Type of authentication used by the service
     * @apiSuccess {String} name Name of the service to send to the server
     * @apiSuccess {String} displayName Name to display
     * @apiSuccess {String} Description Description of the service
     * @apiSuccess {String} baseUrl Url of the service
     * @apiSuccess {String} iconName Name of the icon representing the service
     * @apiSuccess {String} foreground Foreground color associated to the service
     * @apiSuccess {String} background Background color associated to the service
     * @apiSuccess {Array} actions Actions associated with this service
     * @apiSuccess {Array} reactions Reactions associated with this service
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "authType": "oauth",
     *       "name": "google",
     *       "displayName": "Google",
     *       "description": "plus tard",
     *       "baseUrl": "www.google.com",
     *       "iconName": "google",
     *       "foreground": "",
     *       "background": "",
     *       "actions": [{
     *         "name": "google_gmail_new_mail",
     *         "displayName": "New email on Gmail",
     *         "description": "Triggered when a email is received in gmail",
     *         "params": {}
     *       }],
     *       "reactions": [{
     *         "name": "google_gmail_send_email",
     *         "displayName": "Send email with Gmail",
     *         "description": "Send email with Gmail",
     *         "params": {
     *           "addresses": "Array",
     *           "content": "string"
     *         }
     *       }]
     *     }
     */

    Route.get('/:name', 'ServiceController.getService').middleware('area');

    /**
     * @api {get} /services/:name/actions Get all actions associated with a service
     * @apiName getServiceActions
     * @apiGroup Service
     * @apiSuccess {String} name Name to identify the action
     * @apiSuccess {String} displayName Name to display
     * @apiSuccess {String} description Description of the action
     * @apiSuccess {Object} params Parameters of the action
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       [
     *         {
     *           "name": "google_gmail_new_mail",
     *           "displayName": "New email on Gmail",
     *           "description": "Triggered when a email is received in gmail",
     *           "params": {}
     *         }
     *       ]
     *     }
     */
    Route.get('/:name/actions', 'ServiceController.getServiceActions').middleware('area');

    /**
     * @api {get} /services/:name/reactions Get all reactions associated with a service
     * @apiName getServiceReactions
     * @apiGroup Service
     * @apiSuccess {String} name Name to identify the reaction
     * @apiSuccess {String} displayName Name to display
     * @apiSuccess {String} description Description of the reaction
     * @apiSuccess {Object} params Parameters of the reaction
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       [
     *         {
     *           "name": "google_gmail_send_email",
     *           "displayName": "Send email with Gmail",
     *           "description": "Send email with Gmail",
     *           "params": {
     *             "addresses": "Array",
     *             "content": "string"
     *           }
     *         }
     *       ]
     *     }
     */
    Route.get('/:name/reactions', 'ServiceController.getServiceReactions').middleware('area');

}).prefix('services');

Route.group(() => {

    /**
     * @api {get} /actions Get all actions by services
     * @apiName getActions
     * @apiGroup Actions
     * @apiSuccess {String} name Name to identify the action
     * @apiSuccess {String} displayName Name to display
     * @apiSuccess {String} description Description of the action
     * @apiSuccess {Object} params Parameters of the action
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "dropbox": [],
     *       "github": [],
     *       "google": [{
     *         "name": "google_gmail_new_mail",
     *         "displayName": "New email on Gmail",
     *         "description": "Triggered when a email is received in gmail",
     *         "params": {}
     *       }],
     *       "office": [],
     *       "spotify": [],
     *       "twitch": []
     *     }
     */
    Route.get('/', 'ActionController.getActions').middleware('area');

    /**
     * @api {get} /actions/:name Get action by name
     * @apiName getActionByName
     * @apiGroup Actions
     * @apiSuccess {String} name Name to identify the action
     * @apiSuccess {String} displayName Name to display
     * @apiSuccess {String} description Description of the action
     * @apiSuccess {Object} params Parameters of the action
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "name": "google_gmail_new_mail",
     *       "displayName": "New email on Gmail",
     *       "description": "Triggered when a email is received in gmail",
     *       "params": {}
     *     }
     */
    Route.get('/:name', 'ActionController.getActionByName').middleware('area');
}).prefix('actions');

Route.group(() => {

    /**
     * @api {get} /reactions Get all reactions by services
     * @apiName getReactions
     * @apiGroup Reactions
     * @apiSuccess {String} name Name to identify the reaction
     * @apiSuccess {String} displayName Name to display
     * @apiSuccess {String} description Description of the reaction
     * @apiSuccess {Object} params Parameters of the reaction
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "dropbox": [],
     *       "github": [],
     *       "google": [{
     *         "name": "google_gmail_send_email",
     *         "displayName": "Send email with Gmail",
     *         "description": "Send email with Gmail",
     *         "params": {
     *           "addresses": "Array",
     *           "content": "string"
     *         }
     *       }],
     *       "office": [],
     *       "spotify": [],
     *       "twitch": []
     *     }
     */
    Route.get('/', 'ReactionController.getReactions').middleware('area');

    /**
     * @api {get} /reactions/:name Get reaction by name
     * @apiName getReactionByName
     * @apiGroup Reactions
     * @apiSuccess {String} name Name to identify the reaction
     * @apiSuccess {String} displayName Name to display
     * @apiSuccess {String} description Description of the reaction
     * @apiSuccess {Object} params Parameters of the reaction
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *     {
     *       "name": "google_gmail_send_email",
     *       "displayName": "Send email with Gmail",
     *       "description": "Send email with Gmail",
     *       "params": {
     *         "addresses": "Array",
     *         "content": "string"
     *       }
     *     }
     */
    Route.get('/:name', 'ReactionController.getReactionByName').middleware('area');
}).prefix('reactions');

Route.get('auth/social/callback/:service', ({ params, request }) => {
    console.log(params.service);
    console.log(request.all());
});

Route.get('about.json', 'ServerController.getServerInfos');