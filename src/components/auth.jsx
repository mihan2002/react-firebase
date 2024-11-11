import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, provider } from "../config/firebaseConfig";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  //console.log(auth.currentUser);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User created successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, provider);
      alert("Signed in with Google!");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      alert("Signed out successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Sign Up
        </h2>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300"
          >
            Sign Up
          </button>
        </form>

        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleSignInWithGoogle}
            className="w-full px-4 py-2 font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
          >
            Sign In with Google
          </button>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 font-medium text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Sign Out
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-center text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Auth;
