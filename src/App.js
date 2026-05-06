import React, { useState, useEffect } from 'react';
import './App.css';
import Chat from './Chat';
import { FaSun, FaMoon, FaPlus, FaTrash, FaCommentDots } from 'react-icons/fa';
import gemmaLogo from './gemma3.png';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('chatSessions');
    return saved ? JSON.parse(saved) : [{ id: Date.now(), title: 'New Chat', messages: [] }];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    const saved = localStorage.getItem('activeSessionId');
    return saved ? parseInt(saved) : sessions[0]?.id;
  });

  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('activeSessionId', activeSessionId);
  }, [activeSessionId]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleNewChat = () => {
    const newSession = { id: Date.now(), title: 'New Chat', messages: [] };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    if (updated.length === 0) {
      const newSession = { id: Date.now(), title: 'New Chat', messages: [] };
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
    } else {
      setSessions(updated);
      if (activeSessionId === id) setActiveSessionId(updated[0].id);
    }
  };

  const handleUpdateMessages = (messages) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== activeSessionId) return s;
      const firstUserMsg = messages.find(m => m.sender === 'user');
      const title = firstUserMsg
        ? firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '')
        : 'New Chat';
      return { ...s, messages, title };
    }));
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={gemmaLogo} alt="Gemma3" className="gemma-logo" />
        </div>
        <button className="new-chat-btn" onClick={handleNewChat}>
          <FaPlus style={{ marginRight: 8 }} /> New Chat
        </button>
        <div className="session-list">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
              onClick={() => setActiveSessionId(session.id)}
            >
              <FaCommentDots className="session-icon" />
              <span className="session-title">{session.title}</span>
              <button
                className="delete-session-btn"
                onClick={(e) => handleDeleteSession(session.id, e)}
                title="Delete chat"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="main-content">
        <header className="chat-header">
          <span className="header-title">{activeSession?.title || 'New Chat'}</span>
          <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </header>
        <Chat
          key={activeSessionId}
          messages={activeSession?.messages || []}
          onUpdateMessages={handleUpdateMessages}
        />
      </main>
    </div>
  );
}

export default App;
