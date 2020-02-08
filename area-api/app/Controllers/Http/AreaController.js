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

        const area = await Area.create(newAreaInfos);
        const data = request.areaHelper.areaSerialize(area, newAction, newReaction);

        return response.json({
            status: 'success',
            data: data
        });
    }

    async getAreas({auth, request, response}) {
        const userAreas = await Area.query()
        .where('user_id', auth.current.user.id)
        .fetch();

        const areasInfos = userAreas.toJSON();
        let data = [];
        let action;
        let reaction;

        for (var i = 0; i < areasInfos.length; i++) {
            action = await Action.find(areasInfos[i].action_id);
            reaction = await Reaction.find(areasInfos[i].reaction_id);
            data.push(request.areaHelper.areaSerialize(areasInfos[i], action, reaction));
        }

        return response.json({
            status: 'success',
            data: data
        });
    }

    async getArea({auth, params, request, response}) {
        const area = await Area.find(params.id);

        if (!area || area.user_id != auth.current.user.id)
            return response.status(404).json({
                status: 'error',
                message: 'Area doesn\'t exist'
            });

        const action = await Action.find(area.action_id);
        const reaction = await Reaction.find(area.reaction_id);
        const data = request.areaHelper.areaSerialize(area, action, reaction);
            
        return response.json({
            status: 'success',
            data: data
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

    async modifyArea({auth, params, request, response}) {
        const parametersArea = request.only(['last_execution', 'name']);
        const parametersArgs = request.only(['action_args', 'reaction_args']);
        const area = await Area.find(params.id);

        if (!area || area.user_id != auth.current.user.id)
            return response.status(404).json({
                status: 'error',
                message: 'Area doesn\'t exist'
            });
        
        
        area.merge(parametersArea);
        await area.save();

        const action = await Action.find(area.action_id);
        const reaction = await Reaction.find(area.reaction_id);

        if (!action || !reaction)
            return response.status(404).json({
                status: 'error',
                message: 'Action or reaction of the area is invalid'
            });
        
        if (parametersArgs.action_args !== undefined) {
            action.args = parametersArgs.action_args;
            await action.save();
        }

        if (parametersArgs.reaction_args !== undefined) {
            reaction.args = parametersArgs.reaction_args;
            await reaction.save();
        }

        const data = request.areaHelper.areaSerialize(area, action, reaction);

        return response.json({
            status: 'success',
            data: data
        });
    }
}

module.exports = AreaController
