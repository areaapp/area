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
}

module.exports = Service
