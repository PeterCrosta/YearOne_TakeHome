import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import 'firebase/analytics';

// import secrets from './secrets';
// import serviceAccount from './firebase-token.json'
import secrets from './secrets'

// //================Firstore Setup===========================

// const config = {
//     apiKey: "AIzaSyCbIlRaUHjWYWfWseREHjGYQu8sMOQdnu0",
//     authDomain: "yearone-takehome.firebaseapp.com",
//     databaseURL: "https://yearone-takehome.firebaseio.com",
//     projectId: "yearone-takehome",
//     storageBucket: "yearone-takehome.appspot.com",
//     messagingSenderId: "113496552704405171831"
// }

// // Initialize Firebase
// console.log(secrets.firebaseConfig)
firebase.initializeApp(secrets.config);
const db = firebase.firestore()
export const ratings = db.collection('movies')
// firebase.analytics();

// export const db = firebase.firestore();

// export const ratings = db.collection('movies');

// import admin from 'firebase-admin'


// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// })