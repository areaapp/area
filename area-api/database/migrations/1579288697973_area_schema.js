'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AreaSchema extends Schema {
  up () {
    this.create('areas', (table) => {
      table.increments()
      table.timestamps()
      table.integer('id').unsigned()
      table.string('name', 255).notNullable()
      table.string('desc', 255).notNullable()
      table.integer('user_id').unsigned()
      table.integer('action_id').unsigned()
      table.integer('reaction_id').unsigned()
    })
  }

  down () {
    this.drop('areas')
  }
}

module.exports = AreaSchema
