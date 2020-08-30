import { createController } from 'awilix-koa'

import passport from 'koa-passport'

// import { hasPermission } from '../middleware/permission'
import '../lib/passport'

// This is our API controller.
// All it does is map HTTP calls to service calls.
// This way our services could be used in any type of app, not
// just over HTTP.
const api = userService => ({
  findUsers: async ctx => ctx.ok(await userService.find(ctx.query)),
  createUser: async ctx => {
    return ctx.created(await userService.create(ctx.request.body))
  },
  updatePassword: async ctx => {
    return ctx.ok(
      await userService.updatePassword(ctx.params.id, ctx.request.body)
    )
  },
  update: async ctx =>
    ctx.ok(await userService.update(ctx.params.id, ctx.request.body))
})

// Maps routes to method calls on the `api` controller.
// See the `awilix-router-core` docs for info:
// https://github.com/jeffijoe/awilix-router-core
export default createController(api)
  .prefix('/user')
  .before([passport.authenticate('jwt', { session: false })])
  .post('', 'createUser')
  // .get('', 'findUsers', { before: [hasPermission(['view users'])] })
  .get('', 'findUsers')
  .put('/update-password/:id', 'updatePassword')
  .patch('/:id', 'update')
