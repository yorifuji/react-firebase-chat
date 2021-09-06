import * as testing from '@firebase/rules-unit-testing';
import { serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

let testEnv: testing.RulesTestEnvironment | null;

beforeEach(async () => {
  testEnv = await testing.initializeTestEnvironment({
    projectId: 'channel',
    firestore: {
      rules: fs.readFileSync('./firestore.rules', 'utf8'),
    },
  });
});

afterEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.cleanup();
  testEnv = null;
});

describe('作成', () => {
  test('成功', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertSucceeds(
      firestore.collection('channels').add({
        owner: 'alice',
        name: 'channel',
        createdAt: serverTimestamp(),
      })
    );
  });

  test('失敗（未認証）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore();
    await testing.assertFails(
      firestore.collection('channels').add({
        owner: 'alice',
        name: 'channel',
        createdAt: serverTimestamp(),
      })
    );
  });

  test('失敗（owner != request.auth.uid）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertFails(
      firestore.collection('channels').add({
        owner: 'bob',
        name: 'channel',
        createdAt: serverTimestamp(),
      })
    );
  });

  test('失敗（パラメータ不足）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertFails(
      firestore.collection('channels').add({
        owner: 'alice',
        createdAt: serverTimestamp(),
      })
    );
  });

  test('失敗（スキーマエラー）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertFails(
      firestore.collection('channels').add({
        owner: 'alice',
        name: 'channel',
        createdAt: serverTimestamp(),
        foo: 1,
      })
    );
  });
});

describe('更新', () => {
  beforeEach(async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await firestore.doc('channels/channel1').set({
      owner: 'alice',
      name: 'channel',
      createdAt: serverTimestamp(),
    });
  });

  test('成功', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertSucceeds(
      firestore.doc('channels/channel1').update({
        name: 'channel2',
        updatedAt: serverTimestamp(),
      })
    );
  });

  test('失敗（未認証）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore();
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        name: 'channel2',
        updatedAt: serverTimestamp(),
      })
    );
  });

  test('失敗（owner != request.auth.uid）', async () => {
    const firestore = testEnv.authenticatedContext('bob').firestore();
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        name: 'channel2',
        updatedAt: serverTimestamp(),
      })
    );
  });

  test('失敗（ownerの変更）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore();
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        owner: 'bob',
        name: 'channel2',
        updatedAt: serverTimestamp(),
      })
    );
  });

  test('失敗（パラメータ不足）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        name: 'channel2',
      })
    );
  });

  test('失敗（スキーマエラー）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        name: 'channel2',
        updatedAt: serverTimestamp(),
        foo: 1,
      })
    );
  });

  test('失敗（createdAtの更新）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertFails(
      firestore.doc('channels/channel1').update({
        name: 'channel2',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      })
    );
  });
});

describe('削除', () => {
  beforeEach(async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await firestore.doc('channels/channel1').set({
      owner: 'alice',
      name: 'channel',
      createdAt: serverTimestamp(),
    });
  });

  test('成功', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertSucceeds(firestore.doc('channels/channel1').delete());
  });

  test('失敗（未認証）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore();
    await testing.assertFails(firestore.doc('channels/channel1').delete());
  });

  test('失敗（owner != request.auth.uid)', async () => {
    const firestore = testEnv.authenticatedContext('bob').firestore();
    await testing.assertFails(firestore.doc('channels/channel1').delete());
  });
});
