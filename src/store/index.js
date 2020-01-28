import Vue from "vue";
import Vuex from "vuex";
const firebase = require("../firebaseConfig");

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentUser: null,
    userProfile: {},
    posts: [],
    hiddenPosts: []
  },
  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setPosts(state, val) {
      if (val) {
        state.posts = val;
      } else {
        state.posts = [];
      }
    },
    setHiddenPosts(state, val) {
      if (val) {
        // make sure not to add duplicates
        if (!state.hiddenPosts.some(x => x.id === val.id)) {
          state.hiddenPosts.unshift(val);
        }
      } else {
        state.hiddenPosts = [];
      }
    }
  },
  actions: {
    clearData({ commit }) {
      commit("setCurrentUser", null);
      commit("setUserProfile", {});
      commit("setPosts", null);
      commit('setHiddenPosts', null);
    },
    fetchUserProfile({ commit, state }) {
      firebase.usersCollection
        .doc(state.currentUser.uid)
        .get()
        .then(res => {
          commit("setUserProfile", res.data());
        })
        .catch(error => alert(`${error}`));
    },
    updateProfile({ state }, data) { // TODO: quite el commit del primer parametro
      let name = data.name;
      let title = data.title;

      firebase.usersCollection
        .doc(state.currentUser.uid)
        .update({ name, title })
        .then(() => {
          // update all posts by user to reflect new name
          firebase.postsCollection
            .where("userId", "==", state.currentUser.uid)
            .get()
            .then(docs => {
              docs.forEach(doc => {
                firebase.postsCollection.doc(doc.id).update({
                  userName: name
                });
              });
            });

          // update all comments by user to reflect new name
          firebase.commentsCollection
            .where("userId", "==", state.currentUser.uid)
            .get()
            .then(docs => {
              docs.forEach(doc => {
                firebase.commentsCollection
                  .doc(doc.id)
                  .update({ userName: name });
              });
            });
        })
        .catch(error => alert(`${error}`));
    }
  },
  modules: {}
});
