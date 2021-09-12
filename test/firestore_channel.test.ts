import * as testing from '@firebase/rules-unit-testing'
import { serverTimestamp } from 'firebase/firestore'
import fs from 'fs'

let testEnv: testing.RulesTestEnvironment

beforeAll(async () => {
  testEnv = await testing.initializeTestEnvironment({
    projectId: 'channel',
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

describe('チャンネルの作成', () => {
  test('成功', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    const doc = firestore.collection('channels').doc()
    const data = {
      channelID: doc.id,
      owner: 'alice',
      name: 'channel',
      createdAt: serverTimestamp(),
    }
    await testing.assertSucceeds(doc.set(data))
  })

  test('失敗（未認証）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore()
    const doc = firestore.collection('channels').doc()
    const data = {
      channelID: doc.id,
      owner: 'alice',
      name: 'channel',
      createdAt: serverTimestamp(),
    }
    await testing.assertFails(doc.set(data))
  })

  test('失敗（owner != request.auth.uid）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    const doc = firestore.collection('channels').doc()
    const data = {
      channelID: doc.id,
      owner: 'bob',
      name: 'channel',
      createdAt: serverTimestamp(),
    }
    await testing.assertFails(doc.set(data))
  })

  test('失敗（channelID）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    const doc = firestore.collection('channels').doc()
    const data = {
      channelID: 'foo',
      owner: 'alice',
      name: 'channel',
      createdAt: serverTimestamp(),
    }
    await testing.assertFails(doc.set(data))
  })

  test('失敗（パラメータ不足）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    const doc = firestore.collection('channels').doc()
    const data = {
      owner: 'alice',
      name: 'channel',
      createdAt: serverTimestamp(),
    }
    await testing.assertFails(doc.set(data))
  })

  test('失敗（スキーマエラー）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    const doc = firestore.collection('channels').doc()
    const data = {
      channelID: doc.id,
      owner: 'alice',
      name: 'channel',
      createdAt: serverTimestamp(),
      foo: 0,
    }
    await testing.assertFails(doc.set(data))
  })
})

describe('チャンネルの更新', () => {
  beforeEach(async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await firestore.doc('channels/channel1').set({
      channelID: 'channel1',
      owner: 'alice',
      name: 'channel',
      createdAt: serverTimestamp(),
    })
  })

  test('成功', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertSucceeds(
      firestore.doc('channels/channel1').update({
        name: 'channel2',
        updatedAt: serverTimestamp(),
      })
    )
  })

  test('失敗（未認証）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore()
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        name: 'channel2',
        updatedAt: serverTimestamp(),
      })
    )
  })

  test('失敗（owner != request.auth.uid）', async () => {
    const firestore = testEnv.authenticatedContext('bob').firestore()
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        name: 'channel2',
        updatedAt: serverTimestamp(),
      })
    )
  })

  test('失敗（ownerの変更）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore()
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        owner: 'bob',
        name: 'channel2',
        updatedAt: serverTimestamp(),
      })
    )
  })

  test('失敗（channelIDの変更）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore()
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        channelID: 'channel2',
        name: 'channel2',
        updatedAt: serverTimestamp(),
      })
    )
  })

  test('失敗（パラメータ不足）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        name: 'channel2',
      })
    )
  })

  test('失敗（スキーマエラー）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        name: 'channel2',
        updatedAt: serverTimestamp(),
        foo: 1,
      })
    )
  })

  test('失敗（createdAtの更新）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        name: 'channel2',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      })
    )
  })
})

describe('チャンネルの削除', () => {
  beforeEach(async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await firestore.doc('channels/channel1').set({
      channelID: 'channel1',
      owner: 'alice',
      name: 'channel',
      createdAt: serverTimestamp(),
    })
  })

  test('成功', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore()
    await testing.assertSucceeds(firestore.doc('channels/channel1').delete())
  })

  test('失敗（未認証）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore()
    await testing.assertFails(firestore.doc('channels/channel1').delete())
  })

  test('失敗（owner != request.auth.uid)', async () => {
    const firestore = testEnv.authenticatedContext('bob').firestore()
    await testing.assertFails(firestore.doc('channels/channel1').delete())
  })
})
