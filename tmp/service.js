'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ServicesSchema extends Schema {
    up () {
      this.create('Services', (table) => {
        table.increments()
        table.integer('service_id').unsigned()
        table.string('name', 255).notNullable()
        table.string('desc', 255).notNullable()
        table.string('color', 255).notNullable()
        table.string('base_url', 255).notNullable()
        table.string('icon_name', 255).notNullable()
      })
    }
  
    down () { 
      this.drop('Services')
    }
  }
  
  module.exports = ServicesSchema
  