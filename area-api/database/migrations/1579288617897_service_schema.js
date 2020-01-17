'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServiceSchema extends Schema {
  up () {
    this.create('services', (table) => {
      table.increments()
      table.timestamps()
      table.integer('id').unsigned()
      table.string('name', 255).notNullable()
      table.string('desc', 255).notNullable()
      table.string('color', 255).notNullable()
      table.string('base_url', 255).notNullable()
      table.string('icon_name', 255).notNullable()
    })
  }

  down () {
    this.drop('services')
  }
}

module.exports = ServiceSchema
