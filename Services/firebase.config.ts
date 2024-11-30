import firebase from '@react-native-firebase/app';
import '@react-native-firebase/storage';

// Your Firebase configuration object from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBw6N9C4DLpOWb8T6cbLgWSl_-XbD66DzI",
    authDomain: "mtg-capstone-2024.firebaseapp.com",
    projectId: "mtg-capstone-2024",
    storageBucket: "mtg-capstone-2024.appspot.com",
    messagingSenderId: "19174167205",
    appId: "1:19174167205:web:67d826bf903a39c792734c",
    measurementId: "G-ECRWN5YX12"
};

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;