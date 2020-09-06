/**
 * Notification model store.
 *
 * gets the logger injected.
 */
export default function createTripStore(logger, userModel, notificationModel) {
  const model = notificationModel

  const collectionName = model.collection.name

  const returnFields = notificationModel.attributes

  const population = [{ path: 'user', select: userModel.attributes }]

  return {
    /**
     *
     *
     * @returns
     */
    async find() {
      logger.debug(`Finding ${collectionName}`)
      return model.find({}, null, {
        select: returnFields,
        populate: population
      })
    },
    /**
     *
     *
     * @param {*} query
     * @param {*} options
     * @returns
     */
    async paginate(query, options) {
      logger.debug(`Finding and paginating ${collectionName}`)
      return model.paginate(
        query,
        Object.assign(options, { select: returnFields, populate: population })
      )
    },
    /**
     *
     *
     * @param {*} id
     * @returns
     */
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
    /**
     *
     *
     * @param {*} ids
     * @returns
     */
    async findMany(ids) {
      logger.debug(`Getting ${collectionName} with ids`)
      const founds = await model.find(
        {
          _id: {
            $in: ids
          }
        },
        null,
        {
          select: returnFields,
          populate: population
        }
      )
      if (!founds) {
        return null
      }
      return founds
    },
    /**
     *
     *
     * @param {*} data
     * @returns
     */
    async getBy(data) {
      logger.debug(`Getting ${collectionName}`)
      const found = await model
        .findOne(data, returnFields)
        .populate(population)
        .exec()
      if (!found) {
        return null
      }
      return found
    },
    /**
     *
     *
     * @param {*} data
     * @returns
     */
    async create(data) {
      const result = await model.create(data)
      logger.debug(`Created new ${collectionName}`, result)
      return result
    },
    /**
     *
     *
     * @param {*} id
     * @param {*} data
     * @returns
     */
    async update(id, data) {
      const result = await model.findOneAndUpdate(
        { _id: id.toString() },
        data,
        { new: true, select: returnFields, populate: population }
      )

      logger.debug(`Updated ${collectionName} ${id}`, result)
      return result
    },
    /**
     *
     *
     * @param {*} item
     * @returns
     */
    async remove(item) {
      item.remove()
      logger.debug(`Removed ${collectionName} ${item._id}`)
      return item
    }
  }
}
