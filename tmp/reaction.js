'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ReactionsSchema extends Schema {
  up () {
    this.create('reactions', (table) => {
      table.increments()
      table.integer('reaction_id').unsigned()
      table.string('name', 255).notNullable()
      table.string('desc', 255).notNullable()
      table.integer('service_id').unsigned()
    })
  }

  down () { 
    this.drop('reactions')
  }
}

module.exports = ReactionsSchema
