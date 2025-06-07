import React, { useState, useEffect } from 'react'
import axios from axios

export default function Home() {
  const [username, setUsername] = useState("")
  const [isLoggedin, setIsLoggedIn] = useState(false)

  useEffect (() => {
    const checkLoggedInUser = async () => {
      try{
        const token = localStorage.getItem("accessToken");
        if(token){
          const config = {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          };
          const response = await axios.get("http://localhost:8000/api/user/", config)
          setIsLoggedIn(true)
          setUsername(response.data.username )
        }
        else{
          setIsLoggedIn(false)
          setUsername("")
        }
      }
      catch(error){
        setIsLoggedIn(false)
        setUsername("")
      }
    };

    checkLoggedInUser()
  }, [])

  const handleLogout = async () => {
    try{
      const refreshToken = localStorage.getItem("refreshToken")
      if(refreshToken){
        await axios.post("htttp://localhost:8000/api/logout/", {"refresh": refreshToken})
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setIsLoggedIn(false)
        setUsername("")
      }
    }
    catch(error){
      console.log("Fails to Log Out")
    }
  }

  return (
    <div>
      {isLoggedin ? (
        <>
          <h2>Hi, {username}. Thanks for loggin in!</h2>
          <button onClick={handleLogout}>Log Out</button>
        </>
      ):(
        <h2>Please Log In!</h2>
      )}
    </div>
  )
}
