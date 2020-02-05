'use strict'

const Services = use('App/Models/Service');
const Reaction = use('App/Models/Reaction');
const Action = use('App/Models/Action');
const Area = use('App/Models/Area');

class AreaController {

    async getServiceIdFromName(auth, serviceName) {
        const userServices = await Services.query()
        .where('name', serviceName)
        .where('user_id', auth.current.user.id)
        .fetch();

        if (userServices.rows.length != 1)
            return null;
        return userServices.first().id;
    }

    async addArea({auth, request, response}) {
        const paramsNames = ['action_name', 'reaction_name', 'name', 'action_args', 'reaction_args'];
        const parameters = request.only(paramsNames);

        for (let paramName of paramsNames) {
            if (typeof parameters[paramName] === 'undefined') {
                return response.status(400).json({
                    status: 'error',
                    message: paramName + ' invalid'
                });
            }
        }

       const actionServiceName = request.areaHelper.getServiceNameByAction(parameters.action_name);
       const reactionServiceName = request.areaHelper.getServiceNameByReaction(parameters.reaction_name);

       if (!actionServiceName || !reactionServiceName) {
           return response.status(404).json({
               status: 'error',
               message: 'Action or reaction doesn\'t exist'
           });
       }

       const actionServiceId = await this.getServiceIdFromName(auth, actionServiceName);
       const reactionServiceId = await this.getServiceIdFromName(auth, reactionServiceName);

       if (!actionServiceId || !reactionServiceId)
            return response.status(404).json({
                status: 'error',
                message: 'Invalid service'
            });

       const newActionInfos = {
             name: parameters.action_name,
             args: JSON.stringify([parameters.action_args]),
             service_id: actionServiceId
       };

       const newReactionInfos = {
           name: parameters.reaction_name,
           args: JSON.stringify([parameters.reaction_args]),
           service_id: reactionServiceId
       };

       const newAction = await Action.create(newActionInfos);
       const newReaction = await Reaction.create(newReactionInfos);

        const newAreaInfos = {
            name: parameters.name,
            user_id: auth.current.user.id,
            action_id: newAction.id,
            reaction_id: newReaction.id
        };

        await Area.create(newAreaInfos);

        return response.json({
            status: 'success',
            message: 'Area added'
        });
    }

    async getAreas({auth, response}) {
        const userAreas = await Area.query()
        .where('user_id', auth.current.user.id)
        .fetch();

        return response.json({
            status: 'success',
            data: userAreas
        });
    }

    async getArea({auth, params, response}) {
        const userArea = await Area.query()
        .where('user_id', auth.current.user.id)
        .where('id', params.id)
        .fetch();

        if (userArea.rows.length == 0)
            return response.status(404).json({
                status: 'error',
                message: 'Area id doesn\'t exist'
            });
        
        return response.json({
            status: 'success',
            data: userArea
        });
    }

    async deleteArea({auth, params, response}) {
        const userArea = await Area.query()
        .where('user_id', auth.current.user.id)
        .where('id', params.id)
        .fetch();

        if (userArea.rows.length == 0) {
            return response.status(404).json({
                status: 'error',
                message: 'The area doesn\'t exist'
            });
        }

        await Area.query()
        .where('user_id', auth.current.user.id)
        .where('id', params.id)
        .delete();

        return response.json({
            status: 'success',
            message: 'AREA is suppressed'
        });
    }
}

module.exports = AreaController
