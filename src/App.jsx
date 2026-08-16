import { useState } from 'react'
import './App.css'
import WelcomeScreen from './welcome.jsx'
import Login from './login.jsx';
import MainApp from './tamplate.jsx';
import Registration from './registration.jsx';
function App() {
  const [page, setPage] = useState(0);
  switch (page) {
    case 0:
      return (<WelcomeScreen cp={setPage} />);
      break;
    case 1:
      return (<Login cp={setPage} />)
      break;
    case 2:
      return (<Registration cp={setPage} />)
      break;
    default:
      return (<MainApp />)
  }

}

export default App
