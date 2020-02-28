'use strict'

const { test, trait } = use('Test/Suite')('User services management')
const User = use('App/Models/User')
const Factory = use('Factory')

trait('Test/ApiClient');
trait('Auth/Client');

test('Add a service (Invalid service)', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.post('/me/services/gogle')
  .loginVia(user)
  .end();

  response.assertStatus(404);
})

test('Add a service (Service already exist)', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.post('/me/services/google')
  .loginVia(user)
  .end();

  response.assertStatus(400);
})

test('Add a service (Client Type missing)', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.post('/me/services/github').send({
    authCode: "4/132",
  })
  .loginVia(user)
  .end();

  response.assertStatus(400);
})

test('Add a service (authCode missing)', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.post('/me/services/github').send({
    clientType: "web",
  })
  .loginVia(user)
  .end();

  response.assertStatus(400);
})

test('Get user services', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.get('/me/services')
  .loginVia(user)
  .end();

  assert.equal('google', response.body.data.google.name);
})

test('Delete user services (Service unknown for this user)', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.delete('/me/services/twitch')
  .loginVia(user)
  .end();

  response.assertStatus(404);
})

test('Delete user services', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.delete('/me/services/google')
  .loginVia(user)
  .end();

  response.assertStatus(200);
})
