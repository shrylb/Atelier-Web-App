import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "../../../FirebaseConfig";
import './ForgotStyle.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 className='title'>Forgot Password?</h2>
      <p className='instruction'>Enter your email so we can send your password reset link</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          // id  = "email"
          value={email}
          placeholder="Enter your email"
          
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="reset-password-btn">Send Reset Email</button>
      </form>
      {message && <p className='err'>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
