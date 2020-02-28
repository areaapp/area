'use strict'

const { test, trait } = use('Test/Suite')('Create User')
const User = use('App/Models/User')

trait('Test/ApiClient');

test('Signup user with basic authentication', async({assert, client}) => {
  const userCreate = {
    username: 'testUser',
    email: 'test@gmail.com',
    password: 'testPassword',
    register_source: 'web'
  };

  const response = await client.post('auth/signup')
  .send(userCreate).end();

  const users = await User.query()
  .where('email', userCreate.email)
  .first();

  assert.notEqual(users, null);

});

test('Signin user with basic authentication', async({assert, client}) => {
  const userCreate = {
    username: 'testtUser',
    email: 'testt@gmail.com',
    password: 'testtPassword',
    register_source: 'web'
  };

  const responseCreate = await client.post('auth/signup')
  .send(userCreate).end();

  const response = await client.post('auth/signin')
  .send({
    email: userCreate.email,
    password: userCreate.password
  }).end();

  response.assertStatus(200);

});

test('Get Dropbox authorize url', async({assert, client}) => {

  const response = await client.get('auth/oauth/authorize_url/dropbox/web').end();

  response.assertStatus(200);
});

test('Get Github authorize url', async({assert, client}) => {

  const response = await client.get('auth/oauth/authorize_url/github/web').end();

  response.assertStatus(200);
});

test('Get Gitlab authorize url', async({assert, client}) => {

  const response = await client.get('auth/oauth/authorize_url/gitlab/web').end();

  response.assertStatus(200);
});

test('Get Google authorize url', async({assert, client}) => {

  const response = await client.get('auth/oauth/authorize_url/google/web').end();

  response.assertStatus(200);
});

test('Get Office authorize url', async({assert, client}) => {

  const response = await client.get('auth/oauth/authorize_url/office/web').end();

  response.assertStatus(200);
});

test('Get Spotify authorize url', async({assert, client}) => {

  const response = await client.get('auth/oauth/authorize_url/spotify/web').end();

  response.assertStatus(200);
});

test('Get Twitch authorize url', async({assert, client}) => {

  const response = await client.get('auth/oauth/authorize_url/twitch/web').end();

  response.assertStatus(200);
});