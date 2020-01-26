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



Route.get('/auth/social/callback/:serviceName', async ({ params, request, response }) => {
    console.log(params.serviceName);
    console.log(request.all());

    try {
        console.log(await axios.post('http://localhost:8081/auth/oauth/signin/' + params.serviceName, {
        authCode: request.all().code,
        clientType: 'web'
        }));
    } catch (err) {
        //console.log(err);
        return response.status(400).json({
            status: 'error',
            message: '?'
        });
    }
});
