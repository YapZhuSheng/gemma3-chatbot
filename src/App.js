import React, { useState } from 'react';
import './App.css';
import Chat from './Chat';
import { FaSun, FaMoon } from 'react-icons/fa';
import gemmaLogo from './gemma3.png';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>

      <main className="main-content">
        {/* 2. Use <img> instead of <h1> */}
        <header className="chat-header">
          <img
            src={gemmaLogo}
            alt="Gemma3"
            className="gemma-logo"
          />
          <button className="dark-mode-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </header>

        <Chat />
      </main>
    </div>
  );
}

export default App;
