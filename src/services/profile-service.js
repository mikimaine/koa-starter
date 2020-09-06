import { BadRequest, NotFound } from 'fejl'
import { pick } from 'lodash'

// const fetch = require('node-fetch');

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

// Prevent overposting.
const pickProps = data =>
  pick(data, ['first_name', 'last_name', 'phone_number'])
/**
 * Profile Service.
 */
export default class ProfileService {
  /**
   *Creates an instance of ProfileService.
   * @param {*} profileStore
   * @memberof ProfileService
   */
  constructor(profileStore) {
    this.store = profileStore
  }

  /**
   *
   *
   * @param {*} id
   * @returns
   * @memberof ProfileService
   */
  async get(id) {
    assertId(id)
    // If `profileStore.get()` returns a falsy value, we throw a
    // NotFound error with the specified message.
    return this.store
      .get(id)
      .then(NotFound.makeAssert(`profile with id "${id}" not found`))
  }

  /**
   *
   *
   * @param {*} data
   * @returns
   * @memberof ProfileService
   */
  async create(ctx) {
    let data = ctx.req.body
    BadRequest.assert(data, 'No user payload given')
    BadRequest.assert(data.first_name, 'first_name is required')
    BadRequest.assert(data.last_name, 'last_name is required')
    BadRequest.assert(data.email, 'Email is required')
    BadRequest.assert(data.phone_number, 'phone_number is required')
    // BadRequest.assert(ctx.req.file, 'profileImage is required')

    // const profileImage = ctx.req.file.filename
    //     console.log(profileImage, "file")

    return this.store.create(pickProps(data))
  }

  /**
   *
   *
   * @param {*} id
   * @param {*} data
   * @returns
   * @memberof ProfileService
   */
  async update(id, data) {
    assertId(id)
    BadRequest.assert(data, 'No profile payload given')

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
   * @memberof ProfileService
   */
  async remove(id) {
    // Make sure the model exists by calling `get`.
    return this.store.remove(await this.get(id))
  }
}
