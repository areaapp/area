'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Area extends Model {
    static get createdAtColumn () {
        return null;
    }

    static get updatedAtColumn () {
        return null;
    }

    user() {
        return this.hasOne('App/Models/User');
    }

    action() {
        return this.hasOne('App/Models/Action')
    }

    reaction() {
        this.hasOne('App/Models/Reaction')
    }
}

module.exports = Area
