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
export default function createProfileModel(logger) {
  var Schema = mongoose.Schema

  /**
   * ProfileSchema
   */
  const ProfileSchema = new Schema({
    first_name: { type: String, unique: true },
    last_name: { type: String, unique: true },
    phone_number: { type: String, default: '' },
    address: {
      addressLineOne: { type: String, default: '' },
      addressLineTwo: { type: String, default: '' },
      city: { type: String, default: '' },
      country: { type: String, default: '' }
    },
    archived: { type: Boolean, default: false },
    created_at: { type: Date },
    updated_at: { type: Date }
  })

  /**
   * Model attributes to expose
   */
  ProfileSchema.statics.attributes = {
    _id: 1,
    first_name: 1,
    last_name: 1,
    phone_number: 1,
    address: 1,
    archived: 1,
    created_at: 1,
    updated_at: 1
  }

  ProfileSchema.plugin(mongoosePaginate)

  /**
   * Pre save middleware.
   *
   * @desc Sets the created_at and updated_at attributes prior to save
   *
   * @param {Function} next middleware dispatcher
   */
  ProfileSchema.pre('save', function preSave(next) {
    let model = this

    // set date modifications
    let now = moment().toISOString()

    model.created_at = now
    model.updated_at = now
  })

  return mongoose.model('Profiles', ProfileSchema)
}
