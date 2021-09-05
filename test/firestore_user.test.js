const firebase = require('@firebase/rules-unit-testing')
const fs = require('fs');

const project_id = "react-firebase-chat-test-user";

describe("テストの正常実行の確認", () => {

  test("pass test", async () => {
    await firebase.assertSucceeds(Promise.resolve());
  })

  test("fail test", async () => {
    await firebase.assertFails(Promise.reject({
      message: 'PERMISSION_DENIED'
    }));
  })
})

describe("userのテスト", () => {

  //実行前に一度だけ実行（初期化）
  beforeAll(
    async () => {
      await firebase.loadFirestoreRules({
        projectId: project_id,
        rules: fs.readFileSync('./firestore.rules', 'utf8'),
      });
    }
  );

  //ブロックが終わるたび実行
  afterEach(
    async () => {
      await firebase.clearFirestoreData({ projectId: project_id }); //データリセット
    }
  );

  //終わった後に一度だけ実行
  afterAll(
    async () => {
      await Promise.all(
        firebase.apps().map((app) => app.delete()) //生成したアプリを削除
      );
    }
  );

  //条件(projectIdとauth情報）をの指定を関数化
  //auth : {uid:'alice'}
  //auth : {uid:'alice', admin:true} admin
  //auth : null 未認証
  function authedApp(auth) {
    return firebase.initializeTestApp({
      projectId: project_id,
      auth: auth,
    }).firestore();
  }

  describe("読み込み", () => {

    test("成功", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      const users = db.collection("users").orderBy("name")
      await firebase.assertSucceeds(users.get())
    })

    test("失敗（未認証）", async () => {
      const db = authedApp(null);
      const users = db.collection("users").orderBy("name")
      await firebase.assertFails(users.get())
    })

  })

  describe("作成", () => {

    test("成功", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await firebase.assertSucceeds(db.collection("users").doc(user.uid).set({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })

    test("失敗（未認証）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(null)
      await firebase.assertFails(db.collection("users").doc(user.uid).set({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })

    test("失敗（owner != request.auth.uid）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user)
      await firebase.assertFails(db.collection("users").doc(user.uid).set({
        owner: "bob",
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })

    test("失敗（パラメータ不足）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await firebase.assertFails(db.collection("users").doc(user.uid).set({
        owner: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })

    test("失敗（スキーマエラー）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await firebase.assertFails(db.collection("users").doc(user.uid).set({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        foo: 0
        })
      )
    })

  })

  describe("更新", () => {

    test("成功", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await db.collection("users").doc(user.uid).set({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      const result = db.collection("users").doc(user.uid).update({
        owner: user.uid,
        name: user.uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      await firebase.assertSucceeds(result)
    })

    test("失敗（未認証）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await db.collection("users").doc(user.uid).set({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      const db2 = authedApp(null);
      const result = db2.collection("users").doc(user.uid).update({
        owner: user.uid,
        name: user.uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      await firebase.assertFails(result)
    })

    test("失敗（id != request.auth.uid）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await db.collection("users").doc(user.uid).set({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      const user2 = { uid: 'bob' }
      const db2 = authedApp(user2);
      const result = db.collection("users").doc(user2.uid).update({
        owner: user.uid,
        name: user.uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      await firebase.assertFails(result)
    })

    test("失敗（ownerの変更）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await db.collection("users").doc(user.uid).set({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      const result = db.collection("users").doc(user.uid).update({
        owner: "bob",
        name: user.uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      await firebase.assertFails(result)
    })

    test("失敗（スキーマエラー）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await db.collection("users").doc(user.uid).set({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      const result = db.collection("users").doc(user.uid).update({
        owner: user.uid,
        name: user.uid,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        foo: 0
        }
      )
      await firebase.assertFails(result)
    })

    test("失敗（createdAtの更新）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await db.collection("users").doc(user.uid).set({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      const result = db.collection("users").doc(user.uid).update({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
      )
      await firebase.assertFails(result)
    })
  })

  describe("削除", () => {

    test("成功", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      const doc = await db.collection("users").doc(user.uid).set({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      await firebase.assertSucceeds(db.collection("users").doc(user.uid).delete())
    })

    test("失敗（未認証）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      const doc = await db.collection("users").doc(user.uid).set({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      const db2 = authedApp(null);
      await firebase.assertSucceeds(db.collection("users").doc(user.uid).delete())
    })

    test("失敗（owner != request.auth.uid)", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      const doc = await db.collection("users").doc(user.uid).set({
        owner: user.uid,
        name: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }
      )
      const user2 = { uid: 'bob' }
      const db2 = authedApp(user2);
      await firebase.assertSucceeds(db.collection("users").doc(user.uid).delete())
    })

  })

})