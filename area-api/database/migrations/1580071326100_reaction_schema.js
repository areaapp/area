'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReactionSchema extends Schema {
    up () {
        this.create('reactions', (table) => {
            table.increments();
            table.text('name').notNullable();
            table.json('args');
            table.integer('service_id').unsigned().notNullable().references('id').inTable('services').onDelete("cascade");
            table.string('service_name', 80).notNullable()
        })
    }

    down () {
        this.drop('reactions')
    }
}

module.exports = ReactionSchema
