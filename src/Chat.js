import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { FaUser, FaRobot, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

function Chat({ messages, onUpdateMessages }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = { sender: 'user', text: trimmed };
    const botPlaceholder = { sender: 'bot', text: '' };
    const newMessages = [...messages, userMessage, botPlaceholder];
    onUpdateMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const botIndex = newMessages.length - 1;

    const ollamaMessages = [...messages, userMessage].map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    try {
      const response = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemma3:1b',
          messages: ollamaMessages,
          stream: false,
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const botReply = data.message?.content || 'No response from model.';

      let currentIndex = 0;
      function typeCharacter() {
        if (currentIndex <= botReply.length) {
          onUpdateMessages(prev => {
            const updated = [...prev];
            updated[botIndex] = { sender: 'bot', text: botReply.slice(0, currentIndex) };
            return updated;
          });
          currentIndex++;
          setTimeout(typeCharacter, 8);
        } else {
          setIsLoading(false);
        }
      }
      typeCharacter();

    } catch (error) {
      console.error('Error calling the chat API:', error);
      onUpdateMessages(prev => {
        const updated = [...prev];
        updated[botIndex] = {
          sender: 'bot',
          text: '⚠️ Could not reach Ollama. Make sure it is running at `http://127.0.0.1:11434`.',
        };
        return updated;
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <FaRobot className="empty-icon" />
            <p>Start a conversation with Gemma3</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
          >
            <div className="message-icon">
              {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
            </div>
            <div className="message-text">
              {msg.text === '' && msg.sender === 'bot'
                ? <span className="thinking"><FaSpinner className="spin" /> Thinking...</span>
                : <ReactMarkdown>{msg.text}</ReactMarkdown>
              }
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          ref={inputRef}
          type="text"
          placeholder="Message Gemma3..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          disabled={isLoading}
        />
        <button onClick={sendMessage} disabled={isLoading || !input.trim()} title="Send">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default Chat;
