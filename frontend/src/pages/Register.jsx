import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: ""
  });

  const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage , setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (isLoading) return;

      setIsLoading(true);

      try{
        const response = await axios.post("http://localhost:8000/api/register/", formData);
        setSuccessMessage("Registration Successful!");
      }
      catch(error){
        console.log("Error during registration", error.response?.data);
        if(error.response && error.response.data) {
          Object.keys(error.response.data).forEach(field => {
            const errorMessages = error.response.data[field];
            if(errorMessages && errorMessages.length > 0){
              setError(errorMessages[0]);
            } 
          });
        }
      }
      finally{
        setIsLoading(false);
      }
  };

  return (
    <div>
      {error && <p style={{color:"red"}}>{error}</p>}
      {successMessage && <p style={{color:"green"}}>{successMessage}</p>}
      <h2>Register:</h2>
      <form>
        <label>username:</label><br/>
        <input type="text" name="username" value={formData.username} onChange={handleChange}/><br/><br/>

        <label>email:</label><br/>
        <input type="email" name="email" value={formData.email} onChange={handleChange}/><br/><br/>

        <label>password:</label><br/>
        <input type="password" name="password1" value={formData.password1} onChange={handleChange}/><br/><br/>

        <label>confirm password:</label><br/>
        <input type="password" name="password2" value={formData.password2} onChange={handleChange}/><br/><br/>

        <button type="submit" disabled={isLoading} onClick={handleSubmit}>Register</button>
      </form>
      <br/>
      <button onClick={() => navigate('/')} className="underline">
        Already have an account? Login here
      </button>
    </div>
  );
}
