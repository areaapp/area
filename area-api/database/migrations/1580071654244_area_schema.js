'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AreaSchema extends Schema {
  up () {
    this.create('areas', (table) => {
      table.increments()
      table.string('name', 255).notNullable();
      table.string('desc', 255).notNullable();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users');
      table.integer('action_id').unsigned().notNullable().references('id').inTable('actions');
      table.integer('reaction_id').unsigned().notNullable().references('id').inTable('reactions');
    })
  }

  down () {
    this.drop('areas')
  }
}

module.exports = AreaSchema
