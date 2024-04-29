import {
  createUserWithEmailAndPassword,
  getAuth
} from "firebase/auth";
import { initializeApp } from "firebase/app";

import { useState } from "react";

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

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // instantiate the auth service SDK
  const auth = getAuth(app);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  // Handle user sign up with email and password
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Pull out user's data from the userCredential property
      const user = userCredential.user;
    } catch (err) {
      // Handle errors here
      const errorMessage = err.message;
      const errorCode = err.code;

      setError(true);

      switch (errorCode) {
        case "auth/weak-password":
          setErrorMessage("The password is too weak.");
          break;
        case "auth/email-already-in-use":
          setErrorMessage(
            "This email address is already in use by another account."
          );
        case "auth/invalid-email":
          setErrorMessage("This email address is invalid.");
          break;
        case "auth/operation-not-allowed":
          setErrorMessage("Email/password accounts are not enabled.");
          break;
        default:
          setErrorMessage(errorMessage);
          break;
      }
    }
  };

  return (
    <div className='signupContainer'>
      <div className='signupContainer__box'>
        <div className='signupContainer__box__inner'>
          <h1>Sign Up</h1>
          <form className='signupContainer__box__form' onSubmit={handleSubmit}>
            <input
              type='email'
              placeholder='Email'
              onChange={handleChange}
              name='email'
              value={email}
            />
            <input
              type='password'
              placeholder='Password'
              onChange={handleChange}
              name='password'
              value={password}
            />
            <button type='submit'>Sign Up</button>
            {error && <p>{errorMessage}</p>}
          </form>

          <div className='signupContainer__box__login'>
          <p>Already have an account? <a href="/login">Log in</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
