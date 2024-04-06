// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLbuzqTNLPrU032_xBSsxuGf0CnhNeylY",
  authDomain: "worksphere-6c234.firebaseapp.com",
  projectId: "worksphere-6c234",
  storageBucket: "worksphere-6c234.appspot.com",
  messagingSenderId: "740439640795",
  appId: "1:740439640795:web:5a9bcb8e29ff0a14001afe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);