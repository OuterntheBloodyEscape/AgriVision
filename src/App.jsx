import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import WelcomeScreen from './welcome.jsx'
import Login from './login.jsx';
import MainApp from './MainApp.jsx';
import Registration from './registration.jsx';
import { useEffect, useState } from 'react';
import SendOTP from './send_OTP.jsx';
import ResetPassword from './reset_password.jsx';
function App() {
  const [toast_message, setToastMessage] = useState('')
  useEffect(() => {
    if (toast_message === '') {
      return
    }
    const to = setTimeout(() => {
      setToastMessage('')
    }, 2500)
    return () => clearTimeout(to)
  }, [toast_message])
  return (
    <div id='av_body'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to={'/Welcome_Screen'} replace />} />
          <Route path='/Welcome_Screen' element={<WelcomeScreen />} />
          <Route path='/LoginPage' element={<Login tm={setToastMessage} />} />
          <Route path='/Registration' element={<Registration tm={setToastMessage} />} />
          <Route path='/SendOTP' element={<SendOTP />} />
          <Route path='/ResetPassword' element={<ResetPassword />} />
          <Route path='/MainPage/*' element={<MainApp />} />
        </Routes>
      </BrowserRouter>
      <div className={`toast_message_box ${(toast_message === '') ? '' : 'toast_message_box_active'}`}>
        <p>{toast_message}</p>
      </div>
    </div>
  );
}

export default App
