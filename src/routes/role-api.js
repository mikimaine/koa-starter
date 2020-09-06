import { createController } from 'awilix-koa'

import passport from 'koa-passport'

import '../lib/passport'

import { hasPermission } from '../middleware/permission'

// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = roleService => ({
  findRoles: async ctx => ctx.ok(await roleService.find(ctx.query)),
  createRole: async ctx => {
    return ctx.created(await roleService.create(ctx.request.body))
  },
  update: async ctx =>
    ctx.ok(await roleService.update(ctx.params.id, ctx.request.body))
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/role')
  .before([passport.authenticate('jwt', { session: false })])
  .post('', 'createRole', { before: [hasPermission('create role')] })
  .get('', 'findRoles', { before: [hasPermission('view any role')] })
  .patch('/:id', 'update', { before: [hasPermission('update role')] })
