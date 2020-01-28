'use strict'

class ReactionController {
    getReactions({ request, response }) {
        return response.json({
            status: 'success',
            data: request.areaHelper.getReactions()
        });
    }

    getReactionByName({ params, request, response }) {
        const reaction = request.areaHelper.getReactionByName(params.name);

        if (reaction === null) {
            return response.status(404).json({
                status: 'error',
                message: 'Reaction not found'
            });
        }
        return response.json({
            status: 'success',
            data: reaction
        });
    }
}

module.exports = ReactionController
