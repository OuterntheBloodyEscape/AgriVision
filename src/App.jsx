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
          <Route path='/' element={<Navigate to={'/welcome_screen'} replace />} />
          <Route path='/welcome_screen' element={<WelcomeScreen />} />
          <Route path='/login_page' element={<Login tm={setToastMessage} />} />
          <Route path='/registration' element={<Registration tm={setToastMessage} />} />
          <Route path='/main_page/*' element={<MainApp />} />
        </Routes>
      </BrowserRouter>
      <div className={`toast_message_box ${(toast_message === '') ? '' : 'toast_message_box_active'}`}>
        <p>{toast_message}</p>
      </div>
    </div>
  );
}

export default App
