const { hooks } = require('@adonisjs/ignitor')

hooks.after.providersBooted(() => {
  const Exception = use('Exception')

  Exception.handle('InvalidJwtToken', async (error, { response, session }) => {
    return response.status(401).json({
        status: 'error',
        message: 'Token invalid'
    });
  })
})