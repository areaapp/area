'use strict'

class ActionController {
    getActions({ request, response }) {
        return response.json({
            status: 'success',
            data: request.areaHelper.getActions()
        });
    }

    getActionByName({ params, request, response }) {
        const action = request.areaHelper.getActionByName(params.name);

        if (action === null) {
            return response.status(404).json({
                status: 'error',
                message: 'Action not found'
            });
        }
        return response.json({
            status: 'success',
            data: action
        });
    }
}

module.exports = ActionController
