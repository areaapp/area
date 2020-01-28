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
     * @api {post} /auth/oauth/signin/:service Signup/Signin a user with a oauth service
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
    Route.post('oauth/signin/:serviceName', 'Auth/OAuthController.signin');


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
     * @api {get} /reactions Get all eractions by services
     * @apiName getReactions
     * @apiGroup Reactions
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
