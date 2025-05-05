import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";


const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>

        <input 
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
