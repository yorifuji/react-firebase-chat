const firebase = require('@firebase/testing');
const fs = require('fs');

const project_id = "test-reaction";

describe("テストの正常実行の確認", () => {

  test("pass test", async () => {
    await firebase.assertSucceeds(Promise.resolve());
  })

  test("fail test", async () => {
    await firebase.assertFails(Promise.reject());
  })
})

describe("reactionのテスト", () => {

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

  const user = { uid: 'alice' }
  const user_bob = { uid: 'bob' }
  const db = authedApp(user);
  const db_bob = authedApp(user_bob);
  const db_null = authedApp(null);

  describe("読み込み", () => {

    test("成功", async () => {
      const collection = firebase.assertSucceeds(db.collectionGroup('reactions'))
      await firebase.assertSucceeds(collection.get())
    })

    test("失敗（未認証）", async () => {
      const collection = firebase.assertSucceeds(db_null.collectionGroup('reactions'))
      await firebase.assertFails(collection.get())
    })

  })

  describe("作成", () => {

    test("成功", async () => {
      const doc = await db.collection("channels").doc("channelID").collection("posts").add({
        owner: user.uid,
        from: "alice",
        body: "message0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        metadata: {}
      })
      const result = db.collection("channels").doc("channelID").collection("posts").doc(doc.id).collection("reactions").add({
        uid: user.uid,
        channel: "channelID",
        post: "postID",
        emoji: "emoji1",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      await firebase.assertSucceeds(result)
    })

    test("失敗（未認証）", async () => {
      const doc = await db.collection("channels").doc("channelID").collection("posts").add({
        owner: user.uid,
        from: "alice",
        body: "message0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        metadata: {}
      })
      const result = db_null.collection("channels").doc("channelID").collection("posts").doc(doc.id).collection("reactions").add({
        uid: user.uid,
        channel: "channelID",
        post: "postID",
        emoji: "emoji1",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      await firebase.assertFails(result)
    })

    test("失敗（owner != request.auth.uid）", async () => {
      const doc = await db.collection("channels").doc("channelID").collection("posts").add({
        owner: user.uid,
        from: "alice",
        body: "message0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        metadata: {}
      })
      const result = db.collection("channels").doc("channelID").collection("posts").doc(doc.id).collection("reactions").add({
        uid: user_bob.uid,
        channel: "channelID",
        post: "postID",
        emoji: "emoji1",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      await firebase.assertFails(result)
    })

    test("失敗（パラメータ不足）", async () => {
      const doc = await db.collection("channels").doc("channelID").collection("posts").add({
        owner: user.uid,
        from: "alice",
        body: "message0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        metadata: {}
      })
      const result = db.collection("channels").doc("channelID").collection("posts").doc(doc.id).collection("reactions").add({
        uid: user.uid,
        channel: "channelID",
        post: "postID",
        //emoji: "emoji1",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      await firebase.assertFails(result)
    })

    test("失敗（スキーマエラー）", async () => {
      const doc = await db.collection("channels").doc("channelID").collection("posts").add({
        owner: user.uid,
        from: "alice",
        body: "message0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        metadata: {}
      })
      const result = db.collection("channels").doc("channelID").collection("posts").doc(doc.id).collection("reactions").add({
        uid: user.uid,
        channel: "channelID",
        post: "postID",
        emoji: "emoji1",
        emoji2: "emoji2",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      await firebase.assertFails(result)
    })

  })

  // describe("更新", () => {

  //   test("成功", async () => {
  //     const user = { uid: 'alice' }
  //     const db = authedApp(user);
  //     const doc = await db.collection("channels").doc("post-channel").collection("posts").add(({
  //       owner: user.uid,
  //       from: "alice",
  //       body: "message0",
  //       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //       metadata: {}
  //     }))
  //     await firebase.assertSucceeds(db.collection("channels").doc("post-channel").collection("posts").doc(doc.id).update({
  //       owner: user.uid,
  //       from: "alice",
  //       body: "message1",
  //       updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  //       metadata: {}
  //     }))
  //   })

  //   test("失敗（未認証）", async () => {
  //     const user = { uid: 'alice' }
  //     const db = authedApp(user);
  //     const doc = await db.collection("channels").doc("post-channel").collection("posts").add(({
  //       owner: user.uid,
  //       from: "alice",
  //       body: "message0",
  //       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //       metadata: {}
  //     }))
  //     const db2 = authedApp(null);
  //     await firebase.assertFails(db2.collection("channels").doc("post-channel").collection("posts").doc(doc.id).update({
  //       owner: user.uid,
  //       from: "alice",
  //       body: "message1",
  //       updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  //       metadata: {},
  //     }))
  //   })

  //   test("失敗（owner != request.auth.uid）", async () => {
  //     const user = { uid: 'alice' }
  //     const db = authedApp(user);
  //     const channel = "ch0"
  //     await db.collection("channels").doc("post-channel").set({
  //       owner: user.uid,
  //       name: channel,
  //       createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //     })
  //     const user1 = { uid: 'bob' }
  //     const db1 = authedApp(user1);
  //     await firebase.assertFails(db1.collection("channels").doc("post-channel").update({
  //       name: "ch1",
  //       updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  //     }))
  //   })

  //   test("失敗（ownerの変更）", async () => {
  //     const user = { uid: 'alice' }
  //     const db = authedApp(user);
  //     const channel = "ch0"
  //     await db.collection("channels").doc("post-channel").set({
  //       owner: user.uid,
  //       name: channel,
  //       createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //     })
  //     await firebase.assertFails(db.collection("channels").doc("post-channel").update({
  //       owner: "bob",
  //       name: "ch1",
  //       updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  //     }))
  //   })

  //   test("失敗（createdAtの更新）", async () => {
  //     const user = { uid: 'alice' }
  //     const db = authedApp(user);
  //     await db.collection("channels").doc("post-channel").set({
  //       owner: user.uid,
  //       name: "ch0",
  //       createdAt: firebase.firestore.FieldValue.serverTimestamp()
  //     })
  //     await firebase.assertFails(db.collection("channels").doc("post-channel").update({
  //       name: "ch1",
  //       createdAt: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")),
  //       updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  //     }))
  //   })

  //   test("失敗（スキーマエラー）", async () => {
  //     const user = { uid: 'alice' }
  //     const db = authedApp(user);
  //     const doc = await db.collection("channels").doc("post-channel").collection("posts").add(({
  //       owner: user.uid,
  //       from: "alice",
  //       body: "message0",
  //       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //       metadata: {}
  //     }))
  //     await firebase.assertFails(db.collection("channels").doc("post-channel").collection("posts").doc(doc.id).update({
  //       owner: user.uid,
  //       from: "alice",
  //       body: "message1",
  //       updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  //       metadata: {},
  //       foo: 0
  //     }))
  //   })

  //   test("失敗（パラメータ不足）", async () => {
  //     const user = { uid: 'alice' }
  //     const db = authedApp(user);
  //     const doc = await db.collection("channels").doc("post-channel").collection("posts").add(({
  //       owner: user.uid,
  //       from: "alice",
  //       body: "message0",
  //       createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //       metadata: {}
  //     }))
  //     await firebase.assertFails(db.collection("channels").doc("post-channel").collection("posts").doc(doc.id).update({
  //       owner: user.uid,
  //       from: "alice",
  //       body: "message1",
  //       metadata: {},
  //     }))
  //   })

  // })

  describe("削除", () => {

    test("成功", async () => {
      const post = await db.collection("channels").doc("channelID").collection("posts").add({
        owner: user.uid,
        from: "alice",
        body: "message0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        metadata: {}
      })
      const reaction = await db.collection("channels").doc("channelID").collection("posts").doc(post.id).collection("reactions").add({
        uid: user.uid,
        channel: "channelID",
        post: "postID",
        emoji: "emoji1",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      const result = db.collection("channels").doc("channelID").collection("posts").doc(post.id).collection("reactions").doc(reaction.id).delete()
      await firebase.assertSucceeds(result)
    })

    test("失敗（未認証）", async () => {
      const post = await db.collection("channels").doc("channelID").collection("posts").add({
        owner: user.uid,
        from: "alice",
        body: "message0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        metadata: {}
      })
      const reaction = await db.collection("channels").doc("channelID").collection("posts").doc(post.id).collection("reactions").add({
        uid: user.uid,
        channel: "channelID",
        post: "postID",
        emoji: "emoji1",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      const result = db_null.collection("channels").doc("channelID").collection("posts").doc(post.id).collection("reactions").doc(reaction.id).delete()
      await firebase.assertFails(result)
    })

    test("失敗（owner != request.auth.uid)", async () => {
      const post = await db.collection("channels").doc("channelID").collection("posts").add({
        owner: user.uid,
        from: "alice",
        body: "message0",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        metadata: {}
      })
      const reaction = await db.collection("channels").doc("channelID").collection("posts").doc(post.id).collection("reactions").add({
        uid: user.uid,
        channel: "channelID",
        post: "postID",
        emoji: "emoji1",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      const result = db_bob.collection("channels").doc("channelID").collection("posts").doc(post.id).collection("reactions").doc(reaction.id).delete()
      await firebase.assertFails(result)
    })
  })

})