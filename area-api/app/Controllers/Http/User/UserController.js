'use strict'

class UserController {
    getUser({ auth, response }) {
        return response.json({
            status: 'success',
            data: {
                username: auth.current.user.username,
                email: auth.current.user.email,
            }
        });
    }

    async setUserInfos({ auth, request, response }) {
        let user = auth.current.user;
        const params = request.only(['username', 'email']);

        user.username = params.username;
        user.email = params.email;

        await user.save();

        return response.json({
            status: 'success'
        });
    }
}

module.exports = UserController
