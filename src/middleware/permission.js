exports.hasPermission = permissions => async (ctx, next) => {
  const { user } = ctx.state
  const errors = []

  if (typeof permissions === 'string') {
    permissions = [permissions]
  }

  permissions.forEach(permission => {
    if (!user.permissions.includes(permission)) {
      errors.push(`You dont have ${permission} permission`)
    }
  })

  if (errors.length === 0) {
    return next()
  }

  ctx.status = 401
  ctx.body = { error: 'NOT AUTHORIZED', permissions: errors }
}
