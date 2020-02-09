'use strict';

class UserController {
    getUser({ auth, response }) {
        return response.json({
            status: 'success',
            data: {
                username: auth.current.user.username,
                email: auth.current.user.email,
                register_source: auth.current.user.register_source
            }
        });
    }

    async setUserInfos({ auth, request, response }) {
        let user = auth.current.user;
        const params = request.only(['username']);

        if (params.username == undefined)
            return response.status(422).json({
                status: 'error',
                message: 'Username is not provided'
            });

        user.username = params.username;

        await user.save();

        return response.json({
            status: 'success',
            data: user
        });
    }
}

module.exports = UserController;
