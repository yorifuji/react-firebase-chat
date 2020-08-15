const firebase = require('@firebase/testing');
const fs = require('fs');

const project_id = "react-firebase-1a904";


describe("テストの正常実行の確認", () => {

  test("pass test", async () => {
    await firebase.assertSucceeds(Promise.resolve());
  })

  test("fail test", async () => {
    await firebase.assertFails(Promise.reject());
  })
})

describe("channelのテスト", () => {

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
      const channels = firebase.assertSucceeds(db.collection("channels").orderBy("name"))
      await firebase.assertSucceeds(channels.get())
    })

    test("失敗（未認証）", async () => {
      const db = authedApp(null);
      const channels = firebase.assertSucceeds(db.collection("channels").orderBy("name"))
      await firebase.assertFails(channels.get())
    })

  })

  describe("作成", () => {

    test("成功", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await firebase.assertSucceeds(db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })

    test("失敗（未認証）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(null);
      await firebase.assertFails(db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })

    test("失敗（owner != request.auth.uid）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await firebase.assertFails(db.collection("channels").add({
        owner: "bob",
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
      )
    })

    test("失敗（パラメータ不足）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await firebase.assertFails(db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        })
      )
    })

    test("失敗（スキーマエラー）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      await firebase.assertFails(db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        foo: 1
        })
      )
    })

  })

  describe("更新", () => {

    test("成功", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      const doc = await db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      await firebase.assertSucceeds(db.collection("channels").doc(doc.id).update({
        name: "ch1",
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }))
    })
 
    test("失敗（未認証）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      const doc = await db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      const db2 = authedApp(null);
      await firebase.assertFails(db2.collection("channels").doc(doc.id).update({
        name: "ch1",
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }))
    })

    test("失敗（owner != request.auth.uid）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      const doc = await db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      const user1 = { uid: 'bob' }
      const db1 = authedApp(user1);
      await firebase.assertFails(db1.collection("channels").doc(doc.id).update({
        name: "ch1",
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }))
    })

    test("失敗（ownerの変更）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      const doc = await db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      // update
      await firebase.assertFails(db.collection("channels").doc(doc.id).update({
        owner: "bob",
        name: "ch1",
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }))
    })

    test("失敗（パラメータ不足）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      // add
      const doc = await db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      // update
      await firebase.assertFails(db.collection("channels").doc(doc.id).update({
        name: "ch1"
      }))
    })

    test("失敗（スキーマエラー）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      const doc = await db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      // update
      await firebase.assertFails(db.collection("channels").doc(doc.id).update({
        name: "ch1",
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        foo: "bar"
      }))
    })

    test("失敗（createdAtの更新）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      // add
      const doc = await db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      // update
      await firebase.assertFails(db.collection("channels").doc(doc.id).update({
        owner: user.uid,
        name: "ch1",
        createdAt: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      }))
    })
  })

  describe("削除", () => {

    test("成功", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      const doc = await db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      await firebase.assertSucceeds(db.collection("channels").doc(doc.id).delete())
    })

    test("失敗（未認証）", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      const doc = await db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      const db2 = authedApp(null);
      await firebase.assertFails(db2.collection("channels").doc(doc.id).delete())
    })

    test("失敗（owner != request.auth.uid)", async () => {
      const user = { uid: 'alice' }
      const db = authedApp(user);
      const doc = await db.collection("channels").add({
        owner: user.uid,
        name: "ch0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
      const user2 = { uid: 'bob' }
      const db2 = authedApp(user2);
      await firebase.assertFails(db2.collection("channels").doc(doc.id).delete())
    })

  })

})