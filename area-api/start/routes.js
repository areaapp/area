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
    Route.post('oauth/signin', 'Auth/OAuthController.signin');


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
    Route.get('oauth/authorize_url/:serviceName/:clientType', 'Auth/OAuthController.getAuthorizeUrl');
}).prefix('auth');

Route.group(() => {

    /**
     * @api {post} /me/services/:name Create a service instance for this user
     * @apiName Service
     * @apiGroup User
     * @apiHeader {String} authorization Bearer \<token\>
     * @apiParam {String} name Name of the service
     * @apiParam {String} authCode OAuth code got from authorize url
     * @apiParam {String} clientType Type of client making the call. Can be 'web' or 'android'
     */
    Route.post('services/:serviceName', 'User/UserServiceController.addService').middleware('auth');
    
    /**
     * @api {get} /me Get email and username of current user
     * @apiName /me
     * @apiGroup me
     * @apiSuccess {String} username Username of the user
     * @apiSuccess {String} email Email of the user
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *        {
     *          "username": "kylianm",
     *          "email": "kylian.maugue@epitech.eu"
     *        }
     */

    Route.get('/', 'User/UserController.getUser').middleware('auth');

    /**
     * @api {put} /me Modify infos of username
     * @apiName /me
     * @apiGroup me
     * @apiParam {String} email New email of the account
     * @apiSuccess {String} username Username of the user
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *        {
     *          "username": "kylianm"
     *        }
     */

    Route.put('/', 'User/UserController.setUserInfos').middleware('auth');

    /**
     * @api {get} /me/services Get services of one user
     * @apiName /me/services
     * @apiGroup me
     * @apiSuccess {Integer} id Id of the user's services
     * @apiSuccess {Integer} user_id Id of the user
     * @apiSuccess {String} name Name of the service
     * @apiSuccess {String} email Email used to connect to the service
     * @apiSuccess {String} oauth_token Oauth token used for the service
     * @apiSuccess {String} oauth_refresh_token oauth refresh token used for the service
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *        {
     *          "id": "1",
     *          "user_id": "2",
     *          "name": "google",
     *          "email": "kylianm@tek.eu",
     *          "oauth_token": "ya29.Il-8B3Gj-wUoGehca59RqZK2LDZ8NBFVkqEfs6w2UXnzkN_s7QBhilqtBn98ap1nOz1koGHntp_mQlobFf2c38K0KgwslHhXv03c3EmbRWtiFnItohKy0ni0pY3TKlw2TA",
     *          "oauth_refresh_token": "null"
     *        }
     */

    Route.get('/services', 'User/UserServiceController.getUserServices').middleware('auth');

    /**
     * @api {delete} /me/services/:name Delete a service for a user
     * @apiName /me/services/:name
     * @apiGroup me
     * @apiParam {String} name Name of the service to delete
     * @apiSuccess {String} message Message which indicate the name of the service suppressed
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/2 200 OK
     *        {
     *          "message": "The service google is suppressed"
     *        }
     */

    Route.delete('/services/:name', 'User/UserServiceController.deleteService').middleware('auth');

    /**
     * @api {post} /me/area Create an AREA
     * @apiName Area
     * @apiGroup Area
     * @apiParam {String} name Name of the AREA
     * @apiParam {String} action_name Name of the action
     * @apiParam {String} reaction_name Name of the reaction
     * @apiParam {String} reaction_args Arguments of the reaction
     * @apiParam {String} action_args Arguments of the action
     */

    Route.post('/area', 'AreaController.addArea').middleware('auth').middleware('area');

    Route.get('/area', 'AreaController.getAreas').middleware('auth');
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