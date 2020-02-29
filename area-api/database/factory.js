'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

Factory.blueprint('App/Models/User', (faker) => {
   return {
     username: faker.username(),
     email: faker.email(),
     password: faker.password(),
     register_source: 'web'
   }
})

Factory.blueprint('App/Models/Service', (faker) => {
    return {
      user_id: 1,
      name: 'google',
      email: faker.email(),
      oauth_token: null,
      oauth_refresh_token: null
    }
 })

Factory.blueprint('App/Models/Notification', (faker) => {
  return {
    user_id: 1,
    message: faker.string(),
    readed: faker.bool()
  }
})