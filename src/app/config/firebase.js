import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBb378v7ZmE1ymhb2uuo95PERfOMMhAecU',
  authDomain: 'revents-e7a3f.firebaseapp.com',
  databaseURL: 'https://revents-e7a3f.firebaseio.com',
  projectId: 'revents-e7a3f',
  storageBucket: 'revents-e7a3f.appspot.com',
  messagingSenderId: '344739448962',
  appId: '1:344739448962:web:e90b0866b46ead165c8c9b'
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
