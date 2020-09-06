import { env } from './env'

const jwt = require('jsonwebtoken')
const passport = require('koa-passport')
const passportJWT = require('passport-jwt')

// Key for signing JWT token
const key = env.JWT_TOKEN_KEY || 'RandomToken' // please make sure that you have a unique token

const ExtractJWT = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()

const JWTStrategy = passportJWT.Strategy

passport.use(
  new JWTStrategy(
    { jwtFromRequest: ExtractJWT, secretOrKey: key },
    (jwtPayload, cb) => {
      if (!jwtPayload.archived) return cb(null, jwtPayload)

      return cb(null, false, { message: 'Not Valid' })
    }
  )
)

/**
 *
 *
 *
 */
export const passportLib = {
  /**
   *
   *
   * @param {*} data
   * @returns
   */
  sign(data) {
    let permissions = data.roles.reduce(
      (pre, next) => [...pre, ...next.permissions.map(v => v.name)],
      []
    )
    data.permissions = Array.from(
      new Set([...data.permissions, ...permissions])
    )
    delete data.roles
    return jwt.sign(data, key)
  }
}
