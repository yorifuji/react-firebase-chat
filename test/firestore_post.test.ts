import * as testing from '@firebase/rules-unit-testing'
import { serverTimestamp } from 'firebase/firestore'
import fs from 'fs'

let testEnv: testing.RulesTestEnvironment

beforeAll(async () => {
  testEnv = await testing.initializeTestEnvironment({
    projectId: 'post',
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

describe('作成', () => {
  test('成功', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertSucceeds(
      firestore.doc('/channels/channel/posts/post').set({
        owner: 'alice',
        from: 'alice',
        body: 'message0',
        createdAt: serverTimestamp(),
        metadata: {},
      })
    )
  })

  test('失敗（未認証）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore()
    await testing.assertFails(
      firestore.doc('/channels/channel/posts/post').set({
        owner: 'alice',
        from: 'alice',
        body: 'message0',
        createdAt: serverTimestamp(),
        metadata: {},
      })
    )
  })

  test('失敗（owner != request.auth.uid）', async () => {
    const firestore = testEnv.authenticatedContext('bob').firestore()
    await testing.assertFails(
      firestore.doc('/channels/channel/posts/post').set({
        owner: 'alice',
        from: 'alice',
        body: 'message0',
        createdAt: serverTimestamp(),
        metadata: {},
      })
    )
  })

  test('失敗（パラメータ不足）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertFails(
      firestore.doc('/channels/channel/posts/post').set({
        owner: 'alice',
      })
    )
  })

  test('失敗（スキーマエラー）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertFails(
      firestore.doc('/channels/channel/posts/post').set({
        owner: 'alice',
        from: 'alice',
        body: 'message0',
        createdAt: serverTimestamp(),
        metadata: {},
        foo: 1,
      })
    )
  })
})

describe('更新', () => {
  beforeEach(async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await firestore.doc('/channels/channel/posts/post').set({
      owner: 'alice',
      from: 'alice',
      body: 'message0',
      createdAt: serverTimestamp(),
      metadata: {},
    })
  })

  test('成功', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertSucceeds(
      firestore.doc('/channels/channel/posts/post').update({
        owner: 'alice',
        from: 'alice',
        body: 'message1',
        updatedAt: serverTimestamp(),
        metadata: {},
      })
    )
  })

  test('失敗（未認証）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore()
    await testing.assertFails(
      firestore.doc('/channels/channel/posts/post').update({
        owner: 'alice',
        from: 'alice',
        body: 'message1',
        updatedAt: serverTimestamp(),
        metadata: {},
      })
    )
  })

  test('失敗（owner != request.auth.uid）', async () => {
    const firestore = testEnv.authenticatedContext('bob').firestore()
    await testing.assertFails(
      firestore.doc('/channels/channel/posts/post').update({
        owner: 'alice',
        from: 'alice',
        body: 'message1',
        updatedAt: serverTimestamp(),
        metadata: {},
      })
    )
  })

  test('失敗（ownerの変更）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertFails(
      firestore.doc('/channels/channel/posts/post').update({
        owner: 'bob',
        from: 'alice',
        body: 'message1',
        updatedAt: serverTimestamp(),
        metadata: {},
      })
    )
  })

  test('失敗（createdAtの更新）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertFails(
      firestore.doc('/channels/channel/posts/post').update({
        owner: 'alice',
        from: 'alice',
        body: 'message1',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        metadata: {},
      })
    )
  })

  test('失敗（スキーマエラー）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertFails(
      firestore.doc('/channels/channel/posts/post').update({
        owner: 'alice',
        from: 'alice',
        body: 'message1',
        updatedAt: serverTimestamp(),
        metadata: {},
        foo: 1,
      })
    )
  })

  test('失敗（パラメータ不足）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertFails(
      firestore.doc('/channels/channel/posts/post').update({
        owner: 'alice',
      })
    )
  })
})

describe('削除', () => {
  beforeEach(async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await firestore.doc('/channels/channel/posts/post').set({
      owner: 'alice',
      from: 'alice',
      body: 'message0',
      createdAt: serverTimestamp(),
      metadata: {},
    })
  })

  test('成功', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertSucceeds(firestore.doc('/channels/channel/posts/post').delete())
  })

  test('失敗（未認証）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore()
    await testing.assertFails(firestore.doc('/channels/channel/posts/post').delete())
  })

  test('失敗（owner != request.auth.uid)', async () => {
    const firestore = testEnv.authenticatedContext('bob').firestore()
    await testing.assertFails(firestore.doc('/channels/channel/posts/post').delete())
  })
})
