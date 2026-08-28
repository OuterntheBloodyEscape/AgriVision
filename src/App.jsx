import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import WelcomeScreen from './welcome.jsx'
import Login from './login.jsx';
import MainApp from './tamplate.jsx';
import Registration from './registration.jsx';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={'/Welcome_Screen'} replace />} />
        <Route path='/Welcome_Screen' element={<WelcomeScreen />} />
        <Route path='/LoginPage' element={<Login />} />
        <Route path='/Registration' element={<Registration />} />
        <Route path='/MainPage/*' element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
