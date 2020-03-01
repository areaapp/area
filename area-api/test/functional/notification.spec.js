'use strict'

const { test, trait } = use('Test/Suite')('Notification management')
const User = use('App/Models/User')
const Factory = use('Factory')

trait('Test/ApiClient');
trait('Auth/Client');


test('Get notifications', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.get('/me/notifications')
  .loginVia(user)
  .end();

  assert.notEqual(response.body.data, null);
})

test('Modify notification (Invalid id)', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.put('/me/notification/pof')
  .loginVia(user)
  .end();

  response.assertStatus(404);
})

test('Modify notification (Invalid parameter (readed)', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.put('/me/notification/1').send({
    readed: 'abc'})
  .loginVia(user)
  .end();

  response.assertStatus(404);
})


test('Modify notification (No readed value)', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.put('/me/notification/1')
  .loginVia(user)
  .end();

  response.assertStatus(404);
})

test('Delete notification (Invalid id)', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.delete('/me/notification/42')
  .loginVia(user)
  .end();

  response.assertStatus(404);
})

test('Delete notification', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client.delete('/me/notification/1')
  .loginVia(user)
  .end();

  response.assertStatus(200);
})