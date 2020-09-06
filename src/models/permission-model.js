import mongoose from 'mongoose'
import moment from 'moment'
import mongoosePaginate from 'mongoose-paginate'

export default function createRoleModel(logger) {
  var Schema = mongoose.Schema

  /**
   * PermissionSchema
   */
  const PermissionSchema = new Schema({
    name: { type: String, unique: true },
    guard_name: { type: String, default: 'API' },
    created_at: { type: Date }
  })

  /**
   * Model attributes to expose
   */
  PermissionSchema.statics.attributes = {
    _id: 1,
    name: 1,
    guard_name: 1
  }

  PermissionSchema.plugin(mongoosePaginate)

  /**
   * Pre save middleware.
   *
   * @desc Sets the date_created, hashes new Password and last_modified attributes prior to save
   *
   * @param {Function} next middleware dispatcher
   */
  PermissionSchema.pre('save', function preSave(next) {
    // set date modifications
    let now = moment().toISOString()

    this.created_at = now
    next()
  })

  return mongoose.model('Permissions', PermissionSchema)
}
