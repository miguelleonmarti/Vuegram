import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const firebase = require("./firebaseConfig.js");
import "./assets/app.scss";

Vue.config.productionTip = false;

// handle page reloads
let app;
firebase.auth.onAuthStateChanged(user => {
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }

  // TODO: esto debería ir en el store.js o store/index.js

  if (user) {
    store.commit("setCurrentUser", user);
    store.dispatch("fetchUserProfile");

    // realtime updates from our posts collection
    firebase.postsCollection
      .orderBy("createdOn", "desc")
      .onSnapshot(querySnapshot => {
        // check if created by current user
        let createdByCurrentUser;
        if (querySnapshot.docs.length) {
          createdByCurrentUser =
            store.state.currentUser.uid ==
            querySnapshot.docChanges()[0].doc.data().userId
              ? true
              : false; // TODO: es un poco tonto no??
        }

        // add new posts to hiddenPosts array after initial load
        if (
          querySnapshot.docChanges().length !== querySnapshot.docs.length &&
          querySnapshot.docChanges()[0].type == "added" &&
          !createdByCurrentUser
        ) {
          let post = querySnapshot.docChanges()[0].doc.data();
          post.id = querySnapshot.docChanges()[0].doc.id;

          store.commit("setHiddenPosts", post);
        } else {
          const posts = [];
          querySnapshot.forEach(doc => {
            const post = doc.data();
            post.id = doc.id;
            posts.push(post);
          });

          store.commit("setPosts", posts);
        }
      });

    // For user updates
    firebase.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit("setUserProfile", doc.data());
    });
  }
});
