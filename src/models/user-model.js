import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import moment from 'moment'
import mongoosePaginate from 'mongoose-paginate'

var Schema = mongoose.Schema

/**
 * UserSchema
 */
const UserSchema = new Schema({
  username: { type: String, default: '' },
  email: { type: String, default: '' },
  phone_number: { type: String, default: '' },
  password: { type: String },
  password_changed_at: { type: Date },
  active: { type: Boolean, default: true },
  confirmation_code: { type: String },
  confirmed: { type: Boolean, default: true },
  reset_code: { type: String },
  time_zone: { type: String, default: 'UTC' },
  fb_id: { type: String, default: '' },
  fb_token: { type: String, default: '' },
  li_id: { type: String, default: '' },
  li_token: { type: String, default: '' },
  google_id: { type: String, default: '' },
  google_token: { type: String, default: '' },
  push_token: { type: String, default: '' },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Roles' }],
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permissions' }],
  archived: { type: Boolean, default: false },
  last_login: { type: Date },
  created_at: { type: Date },
  updated_at: { type: Date }
})

/**
 * Model attributes to expose
 */
UserSchema.statics.attributes = {
  _id: 1,
  username: 1,
  email: 1,
  phone_number: 1,
  password_changed_at: 1,
  active: 1,
  confirmed: 1,
  time_zone: 1,
  fb_id: 1,
  li_id: 1,
  reset_code: 1,
  google_id: 1,
  roles: 1,
  permissions: 1,
  push_token: 1,
  archived: 1,
  last_login: 1,
  created_at: 1,
  updated_at: 1
}

UserSchema.plugin(mongoosePaginate)

/**
 * Verify the submitted password against the stored one
 *
 * @param {String} password submitted password
 * @param {Function} cb Callback function
 */
UserSchema.methods.verifyPassword = function verifyPassword(passwd) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(passwd, this.password, (err, isMatch) => {
      if (err) {
        return reject(err)
      }

      resolve(isMatch)
    })
  })
}

UserSchema.methods.newPassword = function newPassword(passwd) {
  return new Promise((resolve, reject) => {
    UserSchema.statics.hashPasswd(passwd, (err, hash) => {
      if (err) {
        return reject(err)
      }

      resolve(hash)
    })
  })
}

UserSchema.methods.hasPermission = function hasPermission(permissions) {
  // check if it has permission
  let myPermissions = this.permissions
  this.roles.forEach(element => {
    element.permissions.forEach(permission => {
      myPermissions.push({ name: permission.name })
    })
  })
  return permissions.map(val => {
    return (
      myPermissions.filter(permission => permission.name === val).length > 0
    )
  })
}

/**
 * Pre save middleware.
 *
 * @desc Sets the date_created, hashes new Password and last_modified attributes prior to save
 *
 * @param {Function} next middleware dispatcher
 */
UserSchema.pre('save', function preSave(next) {
  let model = this

  // Hash Password
  UserSchema.statics.hashPasswd(model.password, (err, hash) => {
    if (err) {
      return next(err)
    }

    // set date modifications
    let now = moment().toISOString()

    model.password = hash

    model.created_at = now
    model.updated_at = now
    model.last_login = now

    next()
  })
})

UserSchema.statics.hashPasswd = function(passwd, cb) {
  let createHash = (err, hash) => {
    if (err) {
      return cb(err)
    }

    cb(null, hash)
  }

  let generateSalt = (err, salt) => {
    if (err) {
      return cb(err)
    }

    // Hash the password using the generated salt
    bcrypt.hash(passwd, salt, createHash)
  }

  // Generate a salt factor
  bcrypt.genSalt(12, generateSalt)
}

module.exports = mongoose.model('Users', UserSchema)
