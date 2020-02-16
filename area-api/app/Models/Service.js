'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Service extends Model {
    static get createdAtColumn () {
        return null;
    }

    static get updatedAtColumn () {
        return null;
    }

    user() {
        return this.belongsTo('App/Models/User');
    }

    static get hidden() {
        return ['oauth_token', 'oauth_refresh_token'];
    }
}

module.exports = Service
