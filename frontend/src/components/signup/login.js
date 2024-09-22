import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const SignIn = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        setError(`Error: ${response.status} - ${errorText}`);
        return;
      }
  
      const result = await response.json();
  
      // Call onLogin prop with the token received
      onLogin(result.token);
  
      // Alert the user of a successful login
      alert('Login successful!');
  
      // Navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  

  return (
    <div className="signin-container">
      <div className="LoginContainer">
        <form className="signin-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Sign In</h2>
          {error && <p className="error-message">{error}</p>}
          <div className="input-box">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-box">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="checkbox-group">
            <div>
              <input type="checkbox" />
              <label>Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          <button type="submit" className="signin-button">Sign In</button>
          <div className="switch">
            <p>Don't have an account?</p>
            <button type="button" className="switch-button" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
