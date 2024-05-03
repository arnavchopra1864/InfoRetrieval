import {
  signInWithEmailAndPassword,
  getAuth
} from "firebase/auth";
import { initializeApp } from "firebase/app";

import { useState } from "react";
var signedIn = false;
var user;

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "fact-flow-ai.firebaseapp.com",
    databaseURL: "https://fact-flow-ai-default-rtdb.firebaseio.com",
    projectId: "fact-flow-ai",
    storageBucket: "fact-flow-ai.appspot.com",
    messagingSenderId: "655133873468",
    appId: "1:655133873468:web:b311929d5c340137243a39"
  };
const app = initializeApp(firebaseConfig);

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Instantiate the auth service SDK
  const auth = getAuth(app);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Sign in with email and password in firebase auth service
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // The signed-in user info
      user = userCredential.user;
    } catch (err) {
     // Handle Errors here.
      const errorMessage = err.message;
      const errorCode = err.code;

      setError(true);
      console.log(errorCode)

      switch (errorCode) {
        case "auth/invalid-email":
          setErrorMessage("This email address is invalid.");
          break;
        case "auth/user-disabled":
          setErrorMessage(
            "This email address is disabled by the administrator."
          );
          break;
        case "auth/user-not-found":
          setErrorMessage("This email address is not registered.");
          break;
        case "auth/wrong-password":
          setErrorMessage("The password is invalid or the user does not have a password.")
          break;
        default:
          setErrorMessage(errorMessage);
          break;
      }
    }
  };

  return (
    <div className='signinContainer'>
      <div className='signinContainer__box'>
        <div className='signinContainer__box__inner'>
          <h1>Sign In</h1>
          <form className='signinContainer__box__form' onSubmit={handleSubmit}>
            <input
              type='email'
              placeholder='Email'
              name='email'
              onChange={handleChange}
            />
            <input
              type='password'
              placeholder='Password'
              name='password'
              onChange={handleChange}
            />
            <button type='submit'>Sign In</button>
            {error && <p>{errorMessage}</p>}
          </form>

          <div className='signinContainer__box__signup'>
          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
