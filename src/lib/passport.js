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

// /**
//  *
//  *
//  * @export
//  * @param {*} data
//  * @returns
//  */
// export function sign(data) {
//   return jwt.sign(data, key)
// }
export const passportLib = {
  sign(data) {
    return jwt.sign(data, key)
  }
}
