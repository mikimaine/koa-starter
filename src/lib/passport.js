const jwt = require('jsonwebtoken')

const passport = require('koa-passport')
const passportJWT = require('passport-jwt')

const ExtractJWT = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
const JWTStrategy = passportJWT.Strategy

// const key = require('./env')

/**
 *
 */
passport.use(
  new JWTStrategy(
    { jwtFromRequest: ExtractJWT, secretOrKey: 'your_jwt_secret' },
    (jwtPayload, cb) => {
      if (!jwtPayload.archived) return cb(null, jwtPayload)

      return cb(null, false, { message: 'Not Valid' })
    }
  )
)

export function sign(data) {
  return jwt.sign(data, 'your_jwt_secret')
}
