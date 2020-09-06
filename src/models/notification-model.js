import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate'

export default function createRoleModel(logger) {
  var Schema = mongoose.Schema

  /**
   * NotificationSchema
   */
  const NotificationSchema = new Schema({
    body: { type: String },
    message: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'Users' },
    status: { type: String, default: 'active' },
    archived: { type: Boolean, default: false },
    date_created: { type: Date, default: new Date() },
    last_modified: { type: Date, default: new Date() }
  })

  /**
   * Model attributes to expose
   */
  NotificationSchema.statics.attributes = {
    body: 1,
    message: 1,
    user: 1,
    status: 1,
    archived: 1,
    date_created: 1,
    last_modified: 1
  }

  NotificationSchema.plugin(mongoosePaginate)

  return mongoose.model('Notifications', NotificationSchema)
}
