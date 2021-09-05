import {
  RulesTestEnvironment,
  initializeTestEnvironment,
  assertSucceeds,
  assertFails} from '@firebase/rules-unit-testing'
import { serverTimestamp } from 'firebase/firestore'
import fs from 'fs'

let testEnv: RulesTestEnvironment | null

beforeEach( async () => {
  testEnv = await initializeTestEnvironment({
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
    const ref = firestore.collection("channels").add({
      owner: "user_123",
      name: "channel-123",
      createdAt: serverTimestamp()
    })
    await assertSucceeds(ref)
  })

  test('fail test', async () => {
    // create unauthenticate context
    const ctx = testEnv.unauthenticatedContext()

    // use firestore
    const firestore = ctx.firestore()

    // test
    const ref = firestore.collection("channels").add({
      owner: "user_123",
      name: "channel-123",
      createdAt: serverTimestamp()
    })
    await assertFails(ref)
  })

})
