'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActionSchema extends Schema {
  up () {
    this.create('actions', (table) => {
      table.increments()
      table.timestamps()
      table.string('name', 255).notNullable()
      table.string('desc', 255).notNullable()
      table.string('args', 255).notNullable()
      table.integer('service_id').unsigned()
    })
  }

  down () {
    this.drop('actions')
  }
}

module.exports = ActionSchema
