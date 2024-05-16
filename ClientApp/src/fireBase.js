// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";
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
const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  console.log(permission);
  if (permission === 'granted') {
    
    const tempMessaging = messaging;
    if (tempMessaging) {
      const newSw = await navigator.serviceWorker.register(
        'firebase-messaging-sw.js'
      );
    const token = await getToken(tempMessaging, {
      vapidKey: "BHeEUn_Uuusta8R9cBKEurBByqV2gYGQZ-91yj2aq_akNl6jXW3-DbZ1hYiMsilYCxh7DiNQP9_kb59WxzvYrNs",
      serviceWorkerRegistration:newSw
    });
    console.log(token);
  }
}}