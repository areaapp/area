'use strict'

const { test, trait } = use('Test/Suite')('Generate about.json') 
const Config = use('Config');
const Area = Config.get('area.config')

trait('Test/ApiClient');


test('Generate about.json', async ({ client, assert }) => {

  const response = await client.get('/about.json')
  .end();

  response.assertStatus(200);
})
