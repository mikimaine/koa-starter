import { createController } from 'awilix-koa'
import bodyParser from 'koa-bodyparser'

import passport from 'koa-passport'
import '../lib/passport'
// import notFoundHandler from '../middleware/not-found';
// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = profileService => ({
  findProfile: async ctx => ctx.ok(await profileService.get(ctx.params.id)),
  createProfile: async ctx => {
    return ctx.ok(await profileService.create(ctx.request.body))
  },
  updateProfile: async ctx =>
    ctx.ok(await profileService.update(ctx.params.id, ctx.request.body))
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/profile')
  .before([passport.authenticate('jwt', { session: false })])
  .post('/upload', 'createProfile', {
    before: [bodyParser()]
  })
  .get('/:id', 'findProfile')
  .post('/', 'createProfile')
  .patch('/:id', 'updateProfile')
