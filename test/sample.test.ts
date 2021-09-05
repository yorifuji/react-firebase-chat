import * as testing from '@firebase/rules-unit-testing'
import { serverTimestamp } from 'firebase/firestore'
import fs from 'fs'

let testEnv: testing.RulesTestEnvironment | null

beforeEach( async () => {
  testEnv = await testing.initializeTestEnvironment({
    projectId: "my-project-id",
    firestore: {
      rules: fs.readFileSync('./firestore.rules', 'utf8')
    }
  })
})

afterEach( async () => {
  await testEnv.clearFirestore()
  await testEnv.cleanup()
  testEnv = null
})

describe('this is test', () =>{

  test('pass test', async () => {
    // create context
    const ctx = testEnv.authenticatedContext("user_123")

    // use firestore
    const firestore = ctx.firestore()
    // storage = ctx.storage()

    // test
    await testing.assertSucceeds(firestore.collection("channels").add({
      owner: "user_123",
      name: "channel-123",
      createdAt: serverTimestamp()
    }))
  })

  test('fail test', async () => {
    // create unauthenticate context
    const ctx = testEnv.unauthenticatedContext()

    // use firestore
    const firestore = ctx.firestore()

    // test
    await testing.assertFails(firestore.collection("channels").add({
      owner: "user_123",
      name: "channel-123",
      createdAt: serverTimestamp()
    }))
  })

})
