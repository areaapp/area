'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Reaction extends Model {
    static get createdAtColumn () {
        return null;
    }

    static get updatedAtColumn () {
        return null;
    }
    
    service() {
        return this.belongsTo('App/Models/Service');
    }
}

module.exports = Reaction
