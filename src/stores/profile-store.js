import { pick } from 'lodash'

/**
 * Profile model store.
 *
 * gets the logger injected.
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
        Object.assign(options, { select: returnFields })
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
      const found = await model.find({
        _id: id.toString()
      })
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
      const found = await model.findOne(data)
      if (!found) {
        return null
      }
      return pick(found, [...Object.keys(returnFields)])
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
        { new: true, select: returnFields }
      )
      logger.debug(`Updated ${collectionName} ${id}`, result)
      return result
    },

    async uploadMedia(data) {
      const result = await collectionName.insertOne({
        imagePath: data.filePath
      })
      logger.debug(`Created new ${collectionName}`, result)
      return pick(result, [...Object.keys(returnFields)])
    }
  }
}
