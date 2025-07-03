import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProfilePage } from './pages/ProfilePage';
import GamePage from './pages/GamePage';
import { EditProfile } from './pages/EditProfile';
import AuthManager from './pages/AuthManger';
import Logout from './pages/Logout';
import AlgebraSolveGame from './pages/AlgebraSolveGame';
import MultiplicationMatchGame from './pages/MultiplicationMatchGame';
import DivisionPopGame from './pages/DivisionPopGame';


function App() {
  return (
    <BrowserRouter>
      <AuthManager />
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
          <Route path='/game/:lessonId' element={<GamePage/>}/>
          <Route path='/profile/edit' element={<EditProfile/>}/>
          <Route path='/logout' element={<Logout/>}/>
          <Route path="/algebra-solve/:lessonId" element={<AlgebraSolveGame />} />
          <Route path="/multiplication-match/:lessonId" element={<MultiplicationMatchGame />} />
          <Route path="/division-pop/:lessonId" element={<DivisionPopGame />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
