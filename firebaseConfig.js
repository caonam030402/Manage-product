import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC1sR1qGt5NJZ1VoCOdrcaYLBlDxt7lUAc",
  authDomain: "product-40f22.firebaseapp.com",
  projectId: "product-40f22",
  storageBucket: "product-40f22.appspot.com",
  messagingSenderId: "400293378769",
  appId: "1:400293378769:web:2c00c72ab4abeb816be3f0",
  measurementId: "G-HJ1NT10W4D",
};

const app = initializeApp(firebaseConfig);

export const db = getStorage(app, "gs://product-40f22.appspot.com");
