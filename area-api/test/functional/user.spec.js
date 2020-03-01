'use strict'

const { test, trait } = use('Test/Suite')('User infos')
const User = use('App/Models/User');


trait('Test/ApiClient')
trait('Auth/Client')

test('Get user information', async ({ client, assert }) => {
  const user = await User.find(1);

  const response = await client
    .get('/me')
    .loginVia(user)
    .end();

  const userData = {
    username: user.username,
    email: user.email,
    register_source: user.register_source,
    avatar: user.avatar
  };
  assert.deepEqual(userData, response.body.data);
})

test('Modify user information', async ({ client, assert }) => {
  const user = await User.find(1);
  const newUsername = 'kylian';

  const responsePut = await client.put('/me').send({username: newUsername})
  .loginVia(user)
  .end();

  const response = await client
  .get('/me')
  .loginVia(user)
  .end();

  assert.equal(newUsername, response.body.data.username);
})

test('Modify user information (invalid parameters)', async ({ client, assert }) => {
  const user = await User.find(1);

  const responsePut = await client.put('/me')
  .loginVia(user)
  .end();

  responsePut.assertStatus(422);
})
