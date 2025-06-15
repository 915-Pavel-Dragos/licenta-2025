import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProfilePage } from './pages/ProfilePage';
import GamePage from './pages/GamePage';
import { EditProfile } from './pages/EditProfile';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        <Route path='/game/:lessonId' element={<GamePage/>}/>
        <Route path='/profile/edit' element={<EditProfile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
