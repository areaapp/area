'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class NotificationSchema extends Schema {
  up () {
    this.create('notifications', (table) => {
      table.increments();
      table.integer('user_id').unsigned().references('id').inTable("users").onDelete('cascade');
      table.text('message');
      table.boolean('readed').notNullable();
      table.datetime("created_at").notNullable();
    })
  }

  down () {
    this.drop('notifications');
  }
}

module.exports = NotificationSchema
