import { pick } from 'lodash'

const userModel = require('../models/user-model')
const roleModel = require('../models/role-model')
const permissionModel = require('../models/permission-model')

const returnFields = userModel.attributes
/**
 * User model store.
 *
 * gets the logger injected.
 */
export default function createUserStore(logger) {
  let model = userModel

  let collectionName = model.collection.name
  let population = [
    { path: 'permissions', select: permissionModel.attributes },
    { path: 'roles', select: roleModel.attributes }
  ]
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
      const found = await model.findOne(data, returnFields)
      console.log(found, 'found')

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
    async isMatch(data) {
      logger.debug(`Getting ${collectionName}`)
      const found = await model.findOne({ email: data.email })
      if (!found) {
        return null
      }
      const valid = await found.verifyPassword(data.password)
      if (!valid) {
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
    async updatePassword(id, data) {
      let result = await model.findOne({ _id: id.toString() })
      if (!result) {
        return null
      }
      result.password = await result.newPassword(data.password)
      result = await model.findOneAndUpdate({ _id: id.toString() }, result, {
        new: true
      })
      logger.debug(`Updated ${collectionName} ${id}`, result)
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
