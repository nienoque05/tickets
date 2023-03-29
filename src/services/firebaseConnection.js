
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBundufpd2hRQAvo20qsf8Ui192TKN70FE",
  authDomain: "tickets-3d913.firebaseapp.com",
  projectId: "tickets-3d913",
  storageBucket: "tickets-3d913.appspot.com",
  messagingSenderId: "876984778859",
  appId: "1:876984778859:web:a4fa07f7b809a46280712e",
  measurementId: "G-TKYKR3FCHL"
};

const firebaseApp = initializeApp(firebaseConfig)

const auth = getAuth(firebaseApp)

const db = getFirestore(firebaseApp)

const storage = getStorage(firebaseApp)

export {auth, db, storage}