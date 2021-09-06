import * as testing from '@firebase/rules-unit-testing';
import { serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

let testEnv: testing.RulesTestEnvironment | null;

beforeEach(async () => {
  testEnv = await testing.initializeTestEnvironment({
    projectId: 'my-project-id-user',
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
    // create context
    const ctx = testEnv.authenticatedContext('alice');
    const firestore = ctx.firestore();
    // test
    await testing.assertSucceeds(
      firestore.doc('users/alice').set({
        owner: 'alice',
        name: 'ALICE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
  });

  test('失敗（未認証）', async () => {
    // create context
    const ctx = testEnv.unauthenticatedContext();
    const firestore = ctx.firestore();
    // test
    await testing.assertFails(
      firestore.doc('users/alice').set({
        owner: 'alice',
        name: 'ALICE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
  });

  test('失敗（owner != request.auth.uid）', async () => {
    // create context
    const ctx = testEnv.authenticatedContext('alice');
    const firestore = ctx.firestore();
    // test
    await testing.assertFails(
      firestore.doc('users/alice').set({
        owner: 'bob',
        name: 'ALICE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
  });

  test('失敗（パラメータ不足）', async () => {
    // create context
    const ctx = testEnv.authenticatedContext('alice');
    const firestore = ctx.firestore();
    // test
    await testing.assertFails(
      firestore.doc('users/alice').set({
        owner: 'alice',
        name: 'ALICE',
        // createdAt: serverTimestamp(),
        // updatedAt: serverTimestamp()
      })
    );
  });

  test('失敗（スキーマエラー）', async () => {
    // create context
    const ctx = testEnv.authenticatedContext('alice');
    const firestore = ctx.firestore();
    // test
    await testing.assertFails(
      firestore.doc('users/alice').set({
        owner: 'alice',
        name: 'ALICE',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        foo: 'bar',
      })
    );
  });
});

describe('更新', () => {
  beforeEach(async () => {
    // create context
    const ctx = testEnv.authenticatedContext('alice');
    const firestore = ctx.firestore();
    // create doc
    await firestore.doc('users/alice').set({
      owner: 'alice',
      name: 'ALICE',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  test('成功', async () => {
    // create context
    const ctx = testEnv.authenticatedContext('alice');
    const firestore = ctx.firestore();
    // test
    const ref = firestore.doc('users/alice');
    await testing.assertSucceeds(
      ref.update({
        owner: 'alice',
        name: 'ALICE-updated',
        updatedAt: serverTimestamp(),
      })
    );
  });

  test('失敗（未認証）', async () => {
    // create context
    const ctx = testEnv.unauthenticatedContext();
    const firestore = ctx.firestore();
    // test
    const ref = firestore.doc('users/alice');
    await testing.assertFails(
      ref.update({
        owner: 'alice',
        name: 'ALICE-updated',
        updatedAt: serverTimestamp(),
      })
    );
  });

  test('失敗（id != request.auth.uid）', async () => {
    // create context
    const ctx = testEnv.authenticatedContext('bob');
    const firestore = ctx.firestore();
    // test
    const ref = firestore.doc('users/alice');
    await testing.assertFails(
      ref.update({
        owner: 'alice',
        name: 'ALICE-updated',
        updatedAt: serverTimestamp(),
      })
    );
  });

  test('失敗（ownerの変更）', async () => {
    // create context
    const ctx = testEnv.authenticatedContext('alice');
    const firestore = ctx.firestore();
    // test
    const ref = firestore.doc('users/alice');
    await testing.assertFails(
      ref.update({
        owner: 'bob',
        name: 'ALICE-updated',
        updatedAt: serverTimestamp(),
      })
    );
  });

  test('失敗（スキーマエラー）', async () => {
    // create context
    const ctx = testEnv.authenticatedContext('alice');
    const firestore = ctx.firestore();
    // test
    const ref = firestore.doc('users/alice');
    await testing.assertFails(
      ref.update({
        owner: 'alice',
        name: 'ALICE-updated',
        updatedAt: serverTimestamp(),
        foo: 0,
      })
    );
  });

  test('失敗（createdAtの更新）', async () => {
    // create context
    const ctx = testEnv.authenticatedContext('alice');
    const firestore = ctx.firestore();
    // test
    const ref = firestore.doc('users/alice');
    await testing.assertFails(
      ref.update({
        owner: 'alice',
        name: 'ALICE-updated',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      })
    );
  });
});

describe('削除', () => {
  beforeEach(async () => {
    // create context
    const ctx = testEnv.authenticatedContext('alice');
    const firestore = ctx.firestore();
    // create doc
    await firestore.doc('users/alice').set({
      owner: 'alice',
      name: 'ALICE',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  test('成功', async () => {
    // create context
    const ctx = testEnv.authenticatedContext('alice');
    const firestore = ctx.firestore();
    // test
    await testing.assertSucceeds(firestore.doc('users/alice').delete());
  });

  test('失敗（未認証）', async () => {
    // create context
    const ctx = testEnv.unauthenticatedContext();
    const firestore = ctx.firestore();
    // test
    await testing.assertFails(firestore.doc('users/alice').delete());
  });

  test('失敗（owner != request.auth.uid)', async () => {
    // create context
    const ctx = testEnv.authenticatedContext('bob');
    const firestore = ctx.firestore();
    // test
    await testing.assertFails(firestore.doc('users/alice').delete());
  });
});
