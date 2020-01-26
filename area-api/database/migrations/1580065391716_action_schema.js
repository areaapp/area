'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActionSchema extends Schema {
  up () {
    this.create('actions', (table) => {
      table.increments();
      table.json('args');
      table.string('buffer', 1000).notNullable();
      table.integer('service_id').unsigned().notNullable().references('id').inTable('services');
    })
  }

  down () {
    this.drop('actions')
  }
}

module.exports = ActionSchema
