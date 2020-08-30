const notificationModel = require('../models/notification-model')
const userModel = require('../models/user-model')

const returnFields = notificationModel.attributes
/**
 * Notification model store.
 *
 * gets the logger injected.
 */
export default function createTripStore(logger) {
  let model = notificationModel

  let collectionName = model.collection.name

  let population = [{ path: 'user', select: userModel.attributes }]

  return {
    async find() {
      logger.debug(`Finding ${collectionName}`)
      return model.find({}, null, {
        select: returnFields,
        populate: population
      })
    },

    async paginate(query, options) {
      logger.debug(`Finding and paginating ${collectionName}`)
      return model.paginate(
        query,
        Object.assign(options, { select: returnFields, populate: population })
      )
    },

    async get(id) {
      logger.debug(`Getting ${collectionName} with id ${id}`)
      const found = await model
        .findOne(
          {
            _id: id.toString()
          },
          returnFields
        )
        .populate(population)
        .exec()
      if (!found) {
        return null
      }
      return found
    },

    async getBy(data) {
      logger.debug(`Getting ${collectionName}`)
      const found = await model.findOne(data, returnFields)
      if (!found) {
        return null
      }
      return found
    },

    async findManyBySource(sourceids) {
      logger.debug(`Getting ${collectionName} with ids`)
      const founds = await model.find({
        source_airport_id: {
          $in: sourceids
        }
      })
      if (!founds) {
        return null
      }
      return founds
    },
    async findManyByDestination(sourceids) {
      logger.debug(`Getting ${collectionName} with ids`)
      const founds = await model.find({
        destination_airport_id: {
          $in: sourceids
        }
      })
      if (!founds) {
        return null
      }
      return founds
    },

    async create(data) {
      const result = await model.create(data)
      logger.debug(`Created new ${collectionName}`, result)
      return result
    },

    async update(id, data) {
      const result = await model.findOneAndUpdate(
        { _id: id.toString() },
        data,
        { new: true, select: returnFields }
      )

      logger.debug(`Updated ${collectionName} ${id}`, result)
      return result
    },

    async remove(model) {
      model.remove()
      logger.debug(`Removed ${collectionName} ${model._id}`)
      return model
    }
  }
}
