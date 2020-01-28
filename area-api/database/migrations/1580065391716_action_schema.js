'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActionSchema extends Schema {
  up () {
    this.create('actions', (table) => {
      table.increments();
      table.json('args');
      table.text('buffer').notNullable();
      table.integer('service_id').unsigned().notNullable().references('id').inTable('services');
    })
  }

  down () {
    this.drop('actions')
  }
}

module.exports = ActionSchema
