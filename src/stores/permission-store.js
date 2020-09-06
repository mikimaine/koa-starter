import { pick } from 'lodash'

/**
 * User model store.
 *
 * gets the logger injected.
 */
export default function createPermissionStore(logger, permissionModel) {
  const model = permissionModel

  const collectionName = model.collection.name

  const returnFields = permissionModel.attributes

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
     * @param {*} ids
     * @returns
     */
    async findMany(ids) {
      logger.debug(`Getting ${collectionName} with ids`)
      const founds = await model.find({
        _id: {
          $in: ids
        }
      })
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
    /**
     *
     *
     * @param {*} id
     */
    async remove(id) {
      model.delete(x => x._id === id.toString())
      logger.debug(`Removed ${collectionName} ${id}`)
    }
  }
}
