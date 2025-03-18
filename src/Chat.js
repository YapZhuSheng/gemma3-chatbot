// src/Chat.js
import React, { useState } from 'react';
import './Chat.css';
import { FaUser, FaRobot } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const botPlaceholder = { sender: 'bot', text: 'Thinking...' };
    const newMessages = [...messages, userMessage, botPlaceholder];
    setMessages(newMessages);

    const botIndex = newMessages.length - 1;
    setInput('');

    const ollamaMessages = newMessages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    try {
      const response = await fetch("http://127.0.0.1:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:1b",
          messages: ollamaMessages,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Parsed JSON Response:", data);
      const botReply = data.message && data.message.content 
                        ? data.message.content 
                        : "No response from model.";

      let currentIndex = 0;
      const interval = 1;

      function typeCharacter() {
        if (currentIndex <= botReply.length) {
          setMessages((prev) => {
            const updated = [...prev];
            updated[botIndex] = { sender: 'bot', text: botReply.slice(0, currentIndex) };
            return updated;
          });
          currentIndex++;
          setTimeout(typeCharacter, interval);
        }
      }
      typeCharacter();

    } catch (error) {
      console.error("Error calling the chat API:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[botIndex] = { sender: 'bot', text: 'Sorry, there was an error contacting the model.' };
        return updated;
      });
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
          >
            <div className="message-icon">
              {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
            </div>
            <div className="message-text">
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
