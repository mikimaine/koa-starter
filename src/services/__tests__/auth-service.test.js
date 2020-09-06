import { throws } from 'smid'
import AuthService from '../auth-service'

// This test only verify invariants, not interaction with dependencies.
// That is tested with integration tests.
describe('AuthService', () => {
  describe('login', () => {
    it('throws when not found', async () => {
      const { service, tests } = setup()
      expect((await throws(service.BadRequest('nonexistent'))).message).toMatch(
        /not found/
      )

      expect(await service.BadRequest('1')).toEqual(tests[0])
    })
  })
})
function setup() {
  const tests = [
    { id: '1', username: 'user1', password: '1234' },
    { id: '2', username: 'user2', password: '1234' }
  ]
  // Mock store
  const store = {
    login: jest.fn(async () => [...tests])
  }
  return { service: new AuthService(store), store, tests }
}
