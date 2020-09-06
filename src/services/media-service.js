import { NotFound, BadRequest } from 'fejl'
import { pick } from 'lodash'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

// Prevent overposting.
const pickProps = data => pick(data, ['name', 'description', 'attributes'])

/**
 * Media Service.
 */
export default class MediaService {
  constructor(mediaStore) {
    this.store = mediaStore
  }

  /**
   *
   *
   * @param {*} params
   * @returns
   * @memberof MediaService
   */
  async find(params) {
    const query = {}

    const options = {
      page: parseInt(params.page) || 1,
      sort: params.sort || { date: -1 },
      lean: false,
      limit: parseInt(params.limits) || 50
    }

    const medias = await this.store.paginate(query, options)
    if (!medias) {
      throw new Error('There was an error retrieving medias.')
    }

    return medias
  }

  /**
   *
   *
   * @param {*} params
   * @returns
   * @memberof MediaService
   */
  async filter(params) {
    const query = {}

    const options = {
      page: parseInt(params.page) || 1,
      sort: params.sort || { date: -1 },
      lean: false,
      limit: parseInt(params.limits) || 50
    }

    const medias = await this.store.paginate(query, options)
    if (!medias) {
      throw new Error('There was an error retrieving medias by filter.')
    } else {
      return medias
    }
  }

  /**
   *
   *
   * @param {*} id
   * @returns
   * @memberof MediaService
   */
  async get(id) {
    assertId(id)
    // If `Store.get()` returns a falsy value, we throw a
    // NotFound error with the specified message.
    return this.store
      .get(id)
      .then(NotFound.makeAssert(`Media with id "${id}" not found`))
  }

  /**
   *
   *
   * @param {*} ctx
   * @returns
   * @memberof MediaService
   */
  async create(ctx) {
    const _id = ctx.state.user._id
    // formal file upload needs to be done
    return this.store.create({ ...ctx.req.file, user: _id })
  }

  /**
   *
   *
   * @param {*} id
   * @param {*} data
   * @returns
   * @memberof MediaService
   */
  async update(id, data) {
    assertId(id)
    BadRequest.assert(data, 'No media payload given')
    // Make sure the model exists by calling `get`.
    await this.get(id)

    // Prevent overposting.
    const picked = pickProps(data)
    return this.store.update(id, picked)
  }

  /**
   *
   *
   * @param {*} id
   * @returns
   * @memberof MediaService
   */
  async remove(id) {
    // Make sure the model exists by calling `get`.
    return this.store.remove(await this.get(id))
  }
}
