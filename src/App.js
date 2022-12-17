import logo from './logo.svg';
import './App.css';
import FirebaseAuthService from './FirebaseAuthService';
import { useState } from 'react';
import LoginForm from './Components/LoginForm';

function App() {
  const [user, setUser] = useState(null);

  FirebaseAuthService.subscribeToAuthChanges(setUser);


  return (
    <div className="App">
      <header className="App-header">
        <LoginForm existingUser={user}/>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
