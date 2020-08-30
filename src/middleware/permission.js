const userModel = require('../models/user-model')

exports.hasPermission = permissions => async (ctx, next) => {
  const { user } = ctx.state
  const errors = []
  let userM = await userModel
    .findOne({
      _id: user._id
    })
    .populate([
      {
        path: 'roles',
        populate: {
          path: 'permissions'
        }
      },
      { path: 'permissions' }
    ])

  if (typeof permissions === 'string') {
    permissions = [permissions]
  }

  let results = await userM.hasPermission(permissions)

  if (!results.reduce((pre, current) => pre && current)) {
    results.forEach((val, index) => {
      if (!val) {
        errors.push(`You dont have '${permissions[index]}' permission`)
      }
    })
  }

  if (errors.length === 0) {
    return next()
  }

  ctx.status = 401
  ctx.body = { error: 'NOT AUTHORIZED', permissions: errors }
}
