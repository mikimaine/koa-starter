const Joi = require('joi')

/**
 *
 * @param {*} schemaName
 */
export const authFormRequest = schemaName => async (ctx, next) => {
  let validationObjects = {
    loginUser: () =>
      Joi.object({
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      }).with('email', 'password'),

    loginSocial: () =>
      Joi.object({
        token: Joi.string().required()
      }).with('token'),
    forgetPassword: () =>
      Joi.object({
        email: Joi.string()
          .email()
          .required()
      }),
    resetPassword: () =>
      Joi.object({
        email: Joi.string()
          .email()
          .required(),
        code: Joi.alphanum().required()
      }),
    createUser: () =>
      Joi.object({
        email: Joi.string()
          .email()
          .required(),
        username: Joi.string().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      })
  }

  try {
    const { error } = validationObjects[schemaName]().validate(ctx.request.body)

    if (!error) {
      return next()
    }

    ctx.status = 400

    ctx.body = { error: error.details.map(err => err.message) }
  } catch (error) {
    next()
  }
}
