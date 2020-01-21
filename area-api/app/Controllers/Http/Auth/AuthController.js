'use strict'

const User = use('App/Models/User');
const Services = use('App/Services/index');

class AuthController {

    /**
     * Register a user
     *
     * @function signup
     * @param {Object} auth - JWT Authenticator
     * @param {Object} request - Request
     * @param {Object} response - Response
     * @return response
     */
    async signup({ auth, request, response}) {
        const userInfos = {
            ...request.only(['username', 'email', 'password']),
            'login_source': 'area'
        };

        try {
            const user = await User.create(userInfos);
            const token = await auth.generate(user);

            return response.json({
                status: 'success',
                data: token
            });
        } catch (err) {
            console.log(err);
            let message = 'Error while creating user, please try later.';
            if (err.routine === '_bt_check_unique') {
                message = 'This username already exist.';
            }
            return response.status(400).json({
                status: 'error',
                message
            });
        }
    }


    /**
     * Signin a user
     *
     * @function signin
     * @param {Object} auth - JWT Authenticator
     * @param {Object} request - Request
     * @param {Object} response - Response
     * @return response
     */
    async signin({ auth, request, params, response}) {
        console.log('signin');
        const { email, password } = request.only([
            'email',
            'password',
        ]);

        try {
            const token = await auth.attempt(email, password);

            return response.json({
                status: 'success',
                data: token
            });
        } catch (err) {
            return response.status(400).json({
                status: 'error',
                message: 'Invalid user informations',
            });
        }
    }
}

module.exports = AuthController
