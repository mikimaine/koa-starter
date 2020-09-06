import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

export default function createRoleModel(logger) {
  var Schema = mongoose.Schema

  /**
   * MediaSchema
   */
  const MediaSchema = new Schema({
    file_name: { type: String, default: '' },
    original_name: { type: String, default: '' },
    encoding: { type: String, default: '' },
    mime_type: { type: String, default: '' },
    destination: { type: String, default: '' },
    path: { type: String, default: '' },
    url: { type: String, default: '' },
    user: { type: Schema.Types.ObjectId, ref: 'Users' },
    active: { type: Boolean, default: true }
  })

  /**
   * Model attributes to expose
   */
  MediaSchema.statics.attributes = {
    _id: 1,
    file_name: 1,
    original_name: 1,
    encoding: 1,
    mime_type: 1,
    destination: 1,
    path: 1,
    url: 1,
    user: 1,
    active: 1
  }

  MediaSchema.plugin(mongoosePaginate)

  return mongoose.model('Media', MediaSchema)
}
