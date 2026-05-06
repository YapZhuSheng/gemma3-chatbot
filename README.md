# Gemma3 Chatbot

A lightweight React-based chat interface that runs Google's **Gemma3** large language model locally via [Ollama](https://ollama.com). No cloud API keys required — everything runs on your own machine.

---

## Features

- 💬 **Conversational chat UI** with multi-turn message history
- 🤖 **Local LLM inference** powered by Ollama and Gemma3
- ✍️ **Typewriter animation** for bot responses
- 📝 **Markdown rendering** for formatted model output
- ⌨️ **Keyboard shortcut** — press `Enter` to send messages
- 🔒 **Privacy-first** — all inference runs locally, no data sent to external servers

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, JavaScript |
| UI Components | react-icons, react-markdown |
| LLM Backend | Ollama (local inference) |
| Model | Google Gemma3 1B |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Ollama](https://ollama.com/download) installed and running

---

## Getting Started

### 1. Install and start Ollama

Download and install Ollama from [ollama.com](https://ollama.com/download), then pull the Gemma3 model:

```bash
ollama pull gemma3:1b
```

Start the Ollama server (it usually starts automatically after install):

```bash
ollama serve
```

Verify it is running at `http://127.0.0.1:11434`.

### 2. Clone the repository

```bash
git clone https://github.com/YapZhuSheng/gemma3-chatbot.git
cd gemma3-chatbot
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

---

## Usage

1. Make sure Ollama is running with the Gemma3 model loaded.
2. Type a message in the input box and press **Enter** or click **Send**.
3. The bot will respond with a typewriter animation effect.
4. Continue the conversation — the full chat history is passed with each request for context-aware replies.

---

## Project Structure

```
gemma3-chatbot/
├── public/             # Static assets
├── src/
│   ├── App.js          # Root component
│   ├── App.css         # App-level styles
│   ├── Chat.js         # Core chat component (LLM integration)
│   ├── Chat.css        # Chat UI styles
│   └── index.js        # React entry point
├── package.json
└── README.md
```

---

## How It Works

The frontend sends the full conversation history to the Ollama REST API (`/api/chat`) with each message. Ollama runs inference locally using the Gemma3 model and returns a response. The reply is then rendered character-by-character using a typewriter effect, with Markdown formatting applied for structured output.

---

## License

This project is open source and available under the [MIT License](LICENSE).
