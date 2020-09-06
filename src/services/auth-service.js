import { BadRequest, NotFound } from 'fejl'
import { pick } from 'lodash'

const fetch = require('node-fetch')

const passport = require('../lib/passport')

// Prevent overposting.
const pickProps = data => pick(data, ['username', 'password', 'email', 'roles'])

/**
 * Auth Service.
 */
export default class AuthService {
  /**
   *Creates an instance of AuthService.
   * @param {*} userStore
   * @memberof AuthService
   */
  constructor(userStore, roleStore) {
    this.store = userStore
    this.roleStore = roleStore
  }
  /**
   *
   *
   * @param {*} data
   * @returns
   * @memberof AuthService
   */
  async logIn(ctx) {
    let data = ctx.request.body

    BadRequest.assert(data, 'No user payload given')
    BadRequest.assert(data.email, 'email is required')
    BadRequest.assert(data.password, 'password is required')

    let user = await this.store.isMatch(data)

    NotFound.assert(user, 'User not found')

    let token = passport.sign(user)

    return { ...user, token }
  }

  async logInWithFacebook(ctx) {
    let data = ctx.request.body

    BadRequest.assert(data, 'No Facebook token payload given')
    BadRequest.assert(data.token, 'token is required')

    // check/validate token with facebook
    try {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=email,name&access_token=${data.token}`
      )
      let fbData = await response.json()

      if (fbData.error !== undefined) {
        return { message: fbData.error.message, code: 401 }
      }
      let user = await this.store.getBy({ fb_id: fbData.id })

      if (!user) {
        const newUser = {
          fb_id: fbData.id,
          username: '_ff_' + fbData.name,
          email: fbData.email,
          fb_token: data.token,
          password: data.token
        }
        user = await this.store.create(newUser)
        user['new'] = true
      }

      let token = passport.sign(user)

      return { ...user, token }
    } catch (error) {
      return { error: error }
    }
  }

  async logInWithLinkedIn(ctx) {
    const data = ctx.request.body

    BadRequest.assert(data, 'No LinkedIn token payload given')
    BadRequest.assert(data.token, 'token is required')
    // check/validate token with LinkedIn

    try {
      const response = await fetch(
        `https://api.linkedin.com/v2/me?oauth2_access_token=${data.token}`
      )
      let liData = await response.json()

      if (liData.status === 401) {
        return { message: liData.message, code: 401 }
      }
      // return liData;
      let user = await this.store.getBy({ li_id: liData.id })
      // return user;
      if (!user) {
        const newUser = {
          li_id: liData.id,
          username:
            '_li_' + liData.localizedFirstName + ' ' + liData.localizedLastName,
          email: '',
          li_token: data.token,
          password: data.token
        }
        user = await this.store.create(newUser)
        user['new'] = true
      }

      let token = passport.sign(user)

      return { ...user, token }
    } catch (error) {
      return { error: error }
    }
  }

  async logInWithGoogle(ctx) {
    const data = ctx.request.body

    BadRequest.assert(data, 'No Google token payload given')
    BadRequest.assert(data.token, 'token is required')

    // check/validate token with google
    try {
      const response = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${data.token}`
      )
      let googleData = await response.json()

      if (googleData.error !== undefined) {
        return { message: googleData.error, code: 401 }
      }
      let user = await this.store.getBy({ email: googleData.email })
      if (!user) {
        const newUser = {
          clientId: googleData.sub,
          username: '_go_' + googleData.name,
          email: googleData.email,
          google_token: data.token,
          password: data.token
        }
        user = await this.store.create(newUser)
      }
      let token = passport.sign(user)
      return { ...user, token }
    } catch (error) {
      return { error: error }
    }
  }

  /**
   *
   * @param {*} data
   */
  async forgetPassword(ctx) {
    const data = ctx.request.body

    BadRequest.assert(data, 'No payload given')
    BadRequest.assert(data.email, 'Email is required')

    let user = await this.store.getBy({ email: data.email })
    let code = ''

    if (user) {
      code = Math.floor(1000 + Math.random() * 9000)
      await this.store.update(user._id, { reset_code: code })
      // send reset code email/phone number
    }

    return { success: true, message: 'Reset code sent to users Email', code }
  }

  async resetPassword(ctx) {
    const data = ctx.request.body

    BadRequest.assert(data, 'No payload given')
    BadRequest.assert(data.email, 'Email is required')
    BadRequest.assert(data.code, 'code is required')

    this.logData['reqAction'] = 'Reset Password'

    let user = await this.store.getBy({ email: data.email })

    if (user && user.reset_code === data.code) {
      this.logData['docQuery'] = { email: data.email }
      this.logData['docID'] = user._id
      this.logData['user'] = user._id

      let resetPWDData = {
        reset_code: '',
        password: ''
      }

      await this.store.update(user._id, resetPWDData)
      let token = passport.sign(user)
      return { ...user, token }
    }
    return BadRequest.assert(null, "Code Expired or dosen't exist")
  }
  /**
   *
   *
   * @param {*} data
   * @returns
   * @memberof AuthService
   */
  async create(ctx) {
    const data = ctx.request.body

    BadRequest.assert(data, 'No user payload given')
    BadRequest.assert(data.username, 'Username is required')
    BadRequest.assert(data.email, 'Email is required')
    BadRequest.assert(data.password, 'Password is required')

    let userRole = await this.roleStore.getBy({ name: 'USER' })

    data['roles'] = userRole._id

    // send welcome email

    return this.store.create(pickProps(data))
  }
  /**
   *
   *
   * @returns
   * @memberof AuthService
   */
  async logOut() {
    return true
  }
}
