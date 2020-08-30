import { createController } from 'awilix-koa'

// import notFoundHandler from '../middleware/not-found';
// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = authService => ({
  loginUser: async ctx => {
    return ctx.ok(await authService.logIn(ctx.request.body))
  },
  loginWithFacebook: async ctx => {
    return ctx.ok(await authService.logInWithFacebook(ctx.request.body))
  },
  loginWithLinkedIn: async ctx => {
    return ctx.ok(await authService.logInWithLinkedIn(ctx.request.body))
  },
  loginWithGoogle: async ctx => {
    return ctx.ok(await authService.logInWithGoogle(ctx.request.body))
  },
  forgetPassword: async ctx => {
    return ctx.ok(await authService.forgetPassword(ctx.request.body))
  },
  resetPassword: async ctx => {
    return ctx.ok(await authService.resetPassword(ctx.request.body))
  },
  createUser: async ctx => {
    return ctx.ok(await authService.create(ctx.request.body))
  },
  logoutUser: async ctx => {
    return ctx.created(await authService.logOut(ctx.request.body))
  }
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/auth')
  .post('/login', 'loginUser')
  .post('/login-fb', 'loginWithFacebook')
  .post('/login-li', 'loginWithLinkedIn')
  .post('/login-google', 'loginWithGoogle')
  .post('/forget-password', 'forgetPassword')
  .post('/reset-password', 'resetPassword')
  .post('/', 'createUser')
  .post('/logout', 'logoutUser')
