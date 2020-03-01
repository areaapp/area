'use strict'

/*
|--------------------------------------------------------------------------
| NotificationSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class NotificationSeeder {
  async run () {
    const user = await Factory
    .model('App/Models/User')
    .create();

    const notification = await Factory
    .model('App/Models/Notification')
    .create();

    await user.notifications().save(notification);
    
    const notifications = await Database.table('notifications');
    console.log(notifications);
  }
}

module.exports = NotificationSeeder
