import { createController } from 'awilix-koa'

import passport from 'koa-passport'

import '../lib/passport'

// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = permissionService => ({
  findPermissions: async ctx => ctx.ok(await permissionService.find(ctx.query)),
  createPermission: async ctx => {
    return ctx.created(await permissionService.create(ctx.request.body))
  },
  update: async ctx =>
    ctx.ok(await permissionService.update(ctx.params.id, ctx.request.body))
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/permission')
  .before([passport.authenticate('jwt', { session: false })])
  .post('', 'createPermission')
  .get('', 'findPermissions')
  .patch('/:id', 'update')
