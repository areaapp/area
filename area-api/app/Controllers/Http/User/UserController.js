'use strict';

class UserController {
    getUser({ auth, response }) {
        return response.json({
            status: 'success',
            data: {
                username: auth.current.user.username,
                email: auth.current.user.email,
                register_source: auth.current.user.register_source,
                avatar: auth.current.user.avatar
            }
        });
    }

    async setUserInfos({ auth, request, response }) {
        let user = auth.current.user;
        const params = request.only(['username', 'password']);

        if (params.username == undefined && params.password == undefined)
            return response.status(422).json({
                status: 'error',
                message: 'Invalid params'
            });

        user.merge(params);

        await user.save();

        return response.json({
            status: 'success',
            data: {
                username: user.username,
                email: user.email,
                register_source: user.register_source,
                avatar: user.avatar
            }
        });
    }
}

module.exports = UserController;
