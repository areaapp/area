'use strict'

const { test, trait } = use('Test/Suite')('Reactions')
const User = use('App/Models/User')
const Factory = use('Factory')

trait('Test/ApiClient');

test('Get all reactions by services', async ({ client, assert }) => {

  const response = await client.get('/reactions')
  .end();

  response.assertStatus(200);
})

test('Get all reactions by services (Invalid name)', async ({ client, assert }) => {

  const response = await client.get('/reactions/iueiufq')
  .end();

  response.assertStatus(404);
})

test('Get all reactions by services', async ({ client, assert }) => {

  const response = await client.get('/reactions/dropbox_add_folder')
  .end();

  response.assertStatus(200);
})