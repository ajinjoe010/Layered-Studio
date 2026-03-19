import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2JaHIFZ89GdAG0HwslWqz01YsgUdx0_0",
  authDomain: "layered-a8556.firebaseapp.com",
  projectId: "layered-a8556",
  storageBucket: "layered-a8556.firebasestorage.app",
  messagingSenderId: "655926352308",
  appId: "1:655926352308:web:9ae945816d87d25349bae1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
