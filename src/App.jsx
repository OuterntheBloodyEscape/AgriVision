import { useState } from 'react'
import './App.css'
import WelcomeScreen from './welcome'
import Login from './login';
function App() {
  const [page, setPage] = useState(0);
  return (
    (page == 0) ? (
      <WelcomeScreen cl={() => { setPage(1) }} />
    ) : (<Login />)
  );
}

export default App
