import { RulesTestEnvironment, initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing'
import { serverTimestamp } from 'firebase/firestore'
import fs from 'fs'

let testEnv: RulesTestEnvironment

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'sample',
    firestore: {
      rules: fs.readFileSync('./firestore.rules', 'utf8'),
    },
  })
})

afterAll(async () => {
  await testEnv.cleanup()
})

beforeEach(async () => {
  await testEnv.clearFirestore()
})

describe('this is test', () => {
  test('pass test', async () => {
    // create context
    const ctx = testEnv.authenticatedContext('user_123')

    // use firestore
    const firestore = ctx.firestore()
    // storage = ctx.storage()

    // test
    const ref = firestore.collection('channels').doc()
    const data = {
      channelID: ref.id,
      owner: 'user_123',
      name: 'channel-123',
      createdAt: serverTimestamp(),
    }
    await assertSucceeds(ref.set(data))
  })

  test('fail test', async () => {
    // create unauthenticate context
    const ctx = testEnv.unauthenticatedContext()

    // use firestore
    const firestore = ctx.firestore()

    // test
    const ref = firestore.collection('channels').doc()
    const data = {
      channelID: 'xxxxxxxxxxxxxxx', // channelID must equal as doc.id.
      owner: 'user_123',
      name: 'channel-123',
      createdAt: serverTimestamp(),
    }
    await assertFails(ref.set(data))
  })
})
