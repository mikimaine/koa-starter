import { createController } from 'awilix-koa'
import bodyParser from 'koa-bodyparser'
import passport from 'koa-passport'

import '../lib/passport'
// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = mediaService => ({
  findMedias: async ctx => ctx.ok(await mediaService.find(ctx.query)),
  findMedia: async ctx => ctx.ok(await mediaService.get(ctx.params.id)),
  createMedia: async ctx => ctx.created(await mediaService.create(ctx)),
  updateMedia: async ctx =>
    ctx.ok(await mediaService.update(ctx.params.id, ctx.request.body))
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/media')
  .before([passport.authenticate('jwt', { session: false })])
  .get('', 'findMedias')
  .get('/:id', 'findMedia')
  .post('/', 'createMedia', {
    before: [bodyParser()]
  })
  .put('/:id', 'updateMedia')
