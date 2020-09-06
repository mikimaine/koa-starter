import mongoose from 'mongoose'
import moment from 'moment'
import mongoosePaginate from 'mongoose-paginate'

/**
 *
 *
 * @export
 * @param {*} logger
 * @returns
 */
export default function createRoleModel(logger) {
  var Schema = mongoose.Schema

  /**
   * RoleSchema
   */
  const RoleSchema = new Schema({
    name: { type: String, unique: true },
    guard: { type: String, default: 'API' },
    permissions: [{ type: Schema.Types.ObjectId, ref: 'Permissions' }],
    archived: { type: Boolean, default: false },
    created_at: { type: Date },
    updated_at: { type: Date }
  })

  /**
   * Model attributes to expose
   */
  RoleSchema.statics.attributes = {
    _id: 1,
    name: 1,
    guard: 1,
    permissions: 1,
    archived: 1,
    created_at: 1,
    updated_at: 1
  }

  RoleSchema.plugin(mongoosePaginate)

  /**
   * Pre save middleware.
   *
   * @desc Sets the created_at and updated_at attributes prior to save
   *
   * @param {Function} next middleware dispatcher
   */
  RoleSchema.pre('save', function preSave(next) {
    // set date modifications
    let now = moment().toISOString()

    this.created_at = now
    this.updated_at = now

    next()
  })

  return mongoose.model('Roles', RoleSchema)
}
