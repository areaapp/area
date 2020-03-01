'use strict'

const { test, trait } = use('Test/Suite')('Services')
const User = use('App/Models/User')
const Factory = use('Factory')

trait('Test/ApiClient');

test('Get all services', async ({ client, assert }) => {

  const response = await client.get('/services')
  .end();

  response.assertStatus(200);
})

test('Get one service (Invalid service)', async ({ client, assert }) => {

  const response = await client.get('/services/oisdodsij')
  .end();

  response.assertStatus(404);
})

test('Get one service', async ({ client, assert }) => {

  const response = await client.get('/services/google')
  .end();

  response.assertStatus(200);
})

test('Get actions of one service (Invalid service)', async ({ client, assert }) => {

  const response = await client.get('/services/oisdodsij/actions')
  .end();

  response.assertStatus(404);
})


test('Get actions of one service', async ({ client, assert }) => {

  const response = await client.get('/services/google/actions')
  .end();

  response.assertStatus(200);
})

test('Get reactions of one service (Invalid service)', async ({ client, assert }) => {

  const response = await client.get('/services/oisdodsij/reactions')
  .end();

  response.assertStatus(404);
})

test('Get reactions of one service (Invalid service)', async ({ client, assert }) => {

  const response = await client.get('/services/google/actions')
  .end();

  response.assertStatus(200);
})