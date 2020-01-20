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
const Route = use('Route')
const User = use('App/Models/User')
const Service = use('App/Models/Service')

Route.group(() => {
    /**
     * @api {post} /auth/signin Signin a user
     * @apiName Signin
     * @apiGroup Auth
     *
     * @apiSuccess {String} type Type
     * @apiSuccess {String} token Token
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
     * @api {post} /auth/signup Signup a user
     * @apiName Signup
     * @apiGroup Auth
     * @apiParam {String} username username
     * @apiParam {String} password password
     * @apiParam {String} email email
     *
     * @apiSuccess {String} type Type
     * @apiSuccess {String} token Token
     * @apiSuccess {String} refreshToken Refresh token
     */
    Route.post('signin', 'Auth/AuthController.signin');


    Route.post('oauth/signin', 'Auth/OAuthController.signin');

    Route.get('oauth/authorization/:serviceName', 'Auth/OAuthController.getAuthorizeUrl');
    Route.get('oauth/access_token/:serviceName', 'Auth/OAuthController.getAccessTokenUrl');
}).prefix('auth');

Route.group(() => {

    /**
     * @api {post} /me/services/:name Create a service instance for this user
     * @apiName Service
     * @apiGroup User
     * @apiHeader {String} authorization Bearer \<token\>
     * @apiParam {String} name Name of the service
     * @apiParam {String} token OAuth token of the service
     * @apiParam {String} refresh_token OAuth refresh_token of the service
     */
    Route.post('services/:name', 'UserServiceController.addService').middleware('auth');
}).prefix('me');



Route.get('users', async ({ response }) => {
    const users = await User.all();

    return response.json({
        status: 'success',
        data: users
    });
});

Route.get('services', async ({ response }) => {
    const services = await Service.all();

    return response.json({
        status: 'success',
        data: services
    });
});













Route.get('/auth/social/callback/:serviceName', ({ params, request }) => {
    console.log(params.serviceName + '  ' + request.all().code);
});
