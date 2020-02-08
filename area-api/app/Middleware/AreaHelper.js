'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Area = require('../../area.config.js');

class AreaHelper {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle ({ request }, next) {

        request.areaHelper = {
            all() {
                return Area;
            },

            getActions() {
                let actions = {};
                for (let service in Area) {
                    actions[service] = Area[service].actions;
                }
                return actions;
            },

            getReactions() {
                let reactions = {};
                for (let service in Area) {
                    reactions[service] = Area[service].reactions;
                }
                return reactions;
            },

            getServiceActions(service) {
                if (!(service in Area)) {
                    return null;
                }

                return Area[service].actions;
            },

            getServiceReactions(service) {
                if (!(service in Area)) {
                    return null;
                }

                return Area[service].reactions;
            },

            getServiceAll(service) {
                if (!(service in Area)) {
                    return null;
                }

                return Area[service];
            },

            getActionByName(actionName) {
                const services = this.getActions();
                let actions = [];

                for (let service in services) {
                    Array.prototype.push.apply(actions, services[service]);
                }

                const res = actions.find(({ name }) => name === actionName);
                if (typeof res === 'undefined') {
                    return null;
                }
                return res;
            },

            getReactionByName(reactionName) {
                const services = this.getReactions();
                let reactions = [];

                for (let service in services) {
                    Array.prototype.push.apply(reactions, services[service]);
                }

                const res = reactions.find(({ name }) => name === reactionName);
                if (typeof res === 'undefined') {
                    return null;
                }
                return res;
            }
        };

        // call next to advance the request
        await next()
    }
}

module.exports = AreaHelper