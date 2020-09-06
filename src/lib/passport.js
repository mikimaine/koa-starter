import { env } from './env'

const jwt = require('jsonwebtoken')
const passport = require('koa-passport')
const passportJWT = require('passport-jwt')

const ExtractJWT = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
const JWTStrategy = passportJWT.Strategy

const key = env.JWT_TOKEN_KEY || 'RandomToken' // please make sure that you have a unique token

/**
 *
 */
passport.use(
  new JWTStrategy(
    { jwtFromRequest: ExtractJWT, secretOrKey: key },
    (jwtPayload, cb) => {
      if (!jwtPayload.archived) return cb(null, jwtPayload)

      return cb(null, false, { message: 'Not Valid' })
    }
  )
)

export function sign(data) {
  return jwt.sign(data, key)
}
