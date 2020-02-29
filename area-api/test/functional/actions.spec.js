'use strict'

const { test, trait } = use('Test/Suite')('Actions')
const User = use('App/Models/User')
const Factory = use('Factory')

trait('Test/ApiClient');

test('Get all actions by services', async ({ client, assert }) => {

  const response = await client.get('/actions')
  .end();

  response.assertStatus(200);
})

test('Get all actions by services (Invalid name)', async ({ client, assert }) => {

  const response = await client.get('/actions/iueiufq')
  .end();

  response.assertStatus(404);
})

test('Get all actions by services', async ({ client, assert }) => {

  const response = await client.get('/actions/dropbox_new_content')
  .end();

  response.assertStatus(200);
})