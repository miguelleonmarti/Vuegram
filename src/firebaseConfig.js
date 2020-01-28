import firebase from "firebase";
import "firebase/firestore";

// firebase init goes here
const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

firebase.initializeApp(config);

// firebase utils
const database = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

// firebase collections
const usersCollection = database.collection('users');
const postsCollection = database.collection('posts');
const commentsCollection = database.collection('comments');
const likesCollection = database.collection('likes');

export {
    database,
    auth,
    currentUser,
    usersCollection,
    postsCollection,
    commentsCollection,
    likesCollection
}