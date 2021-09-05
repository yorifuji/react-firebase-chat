import * as testing from '@firebase/rules-unit-testing'
import { serverTimestamp } from 'firebase/firestore'
import { doc, setDoc } from "firebase/firestore";
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

    // pass test
    await testing.assertSucceeds(firestore.collection("channels").add({
      owner: "user_123",
      name: "channel-123",
      createdAt: serverTimestamp()
    }))

    await testing.assertSucceeds(firestore.doc("channels/test").set({
      owner: "user_123",
      name: "channel-123",
      createdAt: serverTimestamp()
    }))
  })

  test('fail test', async () => {
    // create unautenticate context
    const ctx = testEnv.unauthenticatedContext()

    // use firestore
    const firestore = ctx.firestore()

    // fail test
    await testing.assertFails(firestore.collection("channels").add({
      owner: "user_123",
      name: "channel-123",
      createdAt: serverTimestamp()
    }))
  })

})
