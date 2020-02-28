'use strict'

/*
|--------------------------------------------------------------------------
| ServiceSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database')

class ServiceSeeder {
  async run () {
    const user = await Factory
    .model('App/Models/User')
    .create();

    const service = await Factory
    .model('App/Models/Service')
    .create();

    await user.services().save(service);
    
    const services = await Database.table('services');
    console.log(services);
  }
}

module.exports = ServiceSeeder
