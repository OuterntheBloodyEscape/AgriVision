import { useState } from 'react'
import './App.css'
import WelcomeScreen from './welcome.jsx'
import Login from './login.jsx';
import MainApp from './tamplate.jsx';
function App() {
  const [page, setPage] = useState(0);
  return (
    (page == 0) ? (
      <WelcomeScreen cp={setPage} />
    ) : ((page == 1) ? (
      <Login cp={setPage} />
    ) : (
      <MainApp />
    ))
  );
}

export default App
