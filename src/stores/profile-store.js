import { pick } from 'lodash'

const profileModel = require('../models/profile-model')
const returnFields = profileModel.attributes
/**
 * Profile model store.
 *
 * gets the logger injected.
 */
export default function createProfileStore(logger) {
  let model = profileModel

  let collectionName = model.collection.name

  return {
    /**
     *
     *
     * @returns
     */
    async find() {
      logger.debug(`Finding ${collectionName}`)
      return model.find({})
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
