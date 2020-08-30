import { NotFound, BadRequest } from 'fejl'
import { pick } from 'lodash'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

// Prevent overposting.
const pickProps = data =>
  pick(data, ['email', 'password', 'username', 'roles', 'push_token'])

/**
 * User Service.
 */
export default class UserService {
  constructor(userStore, tripStore, notificationStore) {
    this.store = userStore
    this.tripStore = tripStore
    this.notificationStore = notificationStore
  }

  async find(params) {
    const query = {}

    const options = {
      page: parseInt(params.page) || 1,
      sort: params.sort || { date: -1 },
      lean: false,
      limit: parseInt(params.limits) || 50
    }

    const users = await this.store.paginate(query, options)
    if (!users) {
      throw new Error('There was an error retrieving users.')
    } else {
      return users
    }
  }

  async get(id) {
    assertId(id)
    // If `Store.get()` returns a falsy value, we throw a
    // NotFound error with the specified message.
    return this.store
      .get(id)
      .then(NotFound.makeAssert(`User with id "${id}" not found`))
  }

  async create(data) {
    BadRequest.assert(data, 'No user payload given')
    BadRequest.assert(data.username, 'Username is required')
    BadRequest.assert(data.email, 'Email is required')
    BadRequest.assert(data.password, 'Password is required')
    BadRequest.assert(data.role, 'Role is required')

    return this.store.create(pickProps(data))
  }

  async updatePassword(id, data) {
    BadRequest.assert(data, 'No password payload given')

    return this.store.updatePassword(id, pick(data, ['password']))
  }

  async update(id, data) {
    assertId(id)
    BadRequest.assert(data, 'No user payload given')

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
