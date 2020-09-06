import { pick } from 'lodash'

/**
 * Profile Store
 *
 * @export
 * @param {*} logger
 * @param {*} profileModel
 * @returns
 */
export default function createProfileStore(logger, profileModel) {
  const model = profileModel

  const collectionName = model.collection.name

  const returnFields = profileModel.attributes

  const population = []

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
      return pick(result, [...Object.keys(returnFields)])
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
     * @param {*} data
     * @returns
     */
    async uploadMedia(data) {
      const result = await collectionName.insertOne({
        imagePath: data.filePath
      })
      logger.debug(`Created new ${collectionName}`, result)
      return pick(result, [...Object.keys(returnFields)])
    },

    async remove(item) {
      item.remove()
      logger.debug(`Removed ${collectionName} ${item._id}`)
      return item
    }
  }
}
