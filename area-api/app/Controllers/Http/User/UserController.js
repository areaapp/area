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
}

module.exports = UserController
