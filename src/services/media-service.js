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

  async find(params) {
    const query = {}

    const options = {
      page: parseInt(params.page) || 1,
      sort: params.sort || { date: -1 },
      lean: false,
      limit: parseInt(params.limits) || 50
    }

    const categories = await this.store.paginate(query, options)
    if (!categories) {
      throw new Error('There was an error retrieving medias.')
    } else {
      return categories
    }
  }

  async filter(params) {
    const query = {}

    const options = {
      page: parseInt(params.page) || 1,
      sort: params.sort || { date: -1 },
      lean: false,
      limit: parseInt(params.limits) || 50
    }

    const airports = await this.store.paginate(query, options)
    if (!airports) {
      throw new Error('There was an error retrieving airports by their status.')
    } else {
      return airports
    }
  }

  async get(id) {
    assertId(id)
    // If `Store.get()` returns a falsy value, we throw a
    // NotFound error with the specified message.
    return this.store
      .get(id)
      .then(NotFound.makeAssert(`Airport with id "${id}" not found`))
  }

  async create(ctx) {
    const _id = ctx.state.user._id
    const saveData = { ...ctx.req.file, user: _id }
    return this.store.create(saveData)
  }

  async update(id, data) {
    assertId(id)
    BadRequest.assert(data, 'No category payload given')
    // console.log(JSON.parse("["+data.attributes+"]"), 'data')
    // console.log(data.attributes.split(",").map(Number), 'data')
    // Make sure the model exists by calling `get`.
    await this.get(id)

    // Prevent overposting.
    const picked = pickProps(data)
    return this.store.update(id, picked)
  }

  async remove(id) {
    // Make sure the model exists by calling `get`.
    await this.get(id)
    return this.store.remove(id)
  }
}
