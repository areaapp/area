'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AreaSchema extends Schema {
  up () {
    this.create('areas', (table) => {
      table.increments()
      table.string('name', 255).notNullable();
      table.date('last_execution').nullable();
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete("cascade");
      table.integer('action_id').unsigned().notNullable().references('id').inTable('actions').onDelete("cascade");
      table.integer('reaction_id').unsigned().notNullable().references('id').inTable('reactions').onDelete("cascade");
    })
  }

  down () {
    this.drop('areas')
  }
}

module.exports = AreaSchema
