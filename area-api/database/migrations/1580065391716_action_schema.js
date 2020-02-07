'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActionSchema extends Schema {
  up () {
    this.create('actions', (table) => {
      table.increments();
      table.text('name').notNullable();
      table.json('args');
      table.text('buffer').nullable();
      table.integer('service_id').unsigned().notNullable().references('id').inTable('services').onDelete('cascade');
    })
  }

  down () {
    this.drop('actions')
  }
}

module.exports = ActionSchema
