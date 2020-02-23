'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Config = use('Config');
const OauthConfig = Config.get('oauth.config');

class OAuthHelper {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle ({ request }, next) {
        // call next to advance the request
        request.oauthHelper = {
            getService(clientType, serviceName) {
                return OauthConfig[clientType][serviceName];
            }
        };

        await next()
    }
}

module.exports = OAuthHelper
