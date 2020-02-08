'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServiceSchema extends Schema {
    up () {
        this.create('services', (table) => {
            table.increments();
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete("cascade");
            table.string('name', 80).notNullable();
            table.string('email', 255).nullable();
            table.text('oauth_token').nullable();
            table.text('oauth_refresh_token').nullable();
        })
    }

    down () {
        this.drop('services')
    }

    static get createdAtColumn () {
        return null;
    }

    static get updatedAtColumn () {
        return null;
    }
}

module.exports = ServiceSchema
