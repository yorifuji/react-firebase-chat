import * as testing from '@firebase/rules-unit-testing';
import { serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

let testEnv: testing.RulesTestEnvironment | null;

beforeAll(async () => {
  testEnv = await testing.initializeTestEnvironment({
    projectId: 'reaction',
    firestore: {
      rules: fs.readFileSync('./firestore.rules', 'utf8'),
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
  testEnv = null;
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});
afterEach(async () => {});

describe('作成', () => {
  beforeEach(async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await firestore.doc('/channels/channel/posts/post').set({
      owner: 'alice',
      from: 'alice',
      body: 'message0',
      createdAt: serverTimestamp(),
      metadata: {},
    });
  });

  test('成功', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertSucceeds(
      firestore.collection('/channels/channel/posts/post/reactions').add({
        uid: 'alice',
        channel: 'channel',
        post: 'postID',
        emoji: 'emoji1',
        createdAt: serverTimestamp(),
      })
    );
  });

  test('失敗（未認証）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore();
    await testing.assertFails(
      firestore.collection('/channels/channel/posts/post/reactions').add({
        uid: 'alice',
        channel: 'channel',
        post: 'postID',
        emoji: 'emoji1',
        createdAt: serverTimestamp(),
      })
    );
  });

  test('失敗（owner != request.auth.uid）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertFails(
      firestore.collection('/channels/channel/posts/post/reactions').add({
        uid: 'bob',
        channel: 'channel',
        post: 'postID',
        emoji: 'emoji1',
        createdAt: serverTimestamp(),
      })
    );
  });

  test('失敗（パラメータ不足）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertFails(
      firestore.collection('/channels/channel/posts/post/reactions').add({
        uid: 'alice',
        channel: 'channel',
        post: 'postID',
        emoji: 'emoji1',
      })
    );
  });

  test('失敗（スキーマエラー）', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertFails(
      firestore.collection('/channels/channel/posts/post/reactions').add({
        uid: 'alice',
        channel: 'channel',
        post: 'postID',
        emoji: 'emoji1',
        createdAt: serverTimestamp(),
        foo: 1,
      })
    );
  });
});

describe('削除', () => {
  beforeEach(async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await firestore.doc('/channels/channel/posts/post').set({
      owner: 'alice',
      from: 'alice',
      body: 'message0',
      createdAt: serverTimestamp(),
      metadata: {},
    });
    await firestore
      .doc('/channels/channel/posts/post/reactions/reaction1')
      .set({
        uid: 'alice',
        channel: 'channel',
        post: 'postID',
        emoji: 'emoji1',
        createdAt: serverTimestamp(),
      });
  });

  test('成功', async () => {
    const firestore = testEnv.authenticatedContext('alice').firestore();
    await testing.assertSucceeds(
      firestore.doc('/channels/channel/posts/post/reactions/reaction1').delete()
    );
  });

  test('失敗（未認証）', async () => {
    const firestore = testEnv.unauthenticatedContext().firestore();
    await testing.assertFails(
      firestore.doc('/channels/channel/posts/post/reactions/reaction1').delete()
    );
  });

  test('失敗（owner != request.auth.uid)', async () => {
    const firestore = testEnv.authenticatedContext('bob').firestore();
    await testing.assertFails(
      firestore.doc('/channels/channel/posts/post/reactions/reaction1').delete()
    );
  });
});
