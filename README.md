# CodeAgentix: Advanced AI-Powered Multi-Agent Online Code-Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Dharmendra2567/CodeAgentix-AI-Code-Studio)
![Hits](https://komarev.com/ghpvc/?username=Dharmendra2567&repo=CodeAgentix-AI-Code-Studio&label=Repo%20Views&color=brightgreen&style=flat)

CodeAgentix is a state-of-the-art online Integrated Development Environment (IDE) that leverages a collaborative multi-agent AI architecture to assist developers in writing, executing, and optimizing code. By combining the power of Llama 3 (via OpenRouter), Google Gemini, and a specialized microservices architecture, CodeAgentix offers an intelligent development experience beyond traditional editors.

---

## 🚀 Key Features

### 🧠 Intelligent Multi-Agent Architecture
CodeAgentix isn't just a code editor; it's a team of specialized AI agents working together:
- **Code Generation Agent**: Instantly transforms natural language descriptions into production-ready code.
- **Simulated Execution Agent**: Utilizes advanced LLM reasoning (Llama-3-8B) to simulate terminal outputs across dozens of programming languages without requiring local compilers.
- **Refactoring Agent**: Analyzes code quality and execution results to suggest optimized, clean-code improvements.
- **Web Suite Agents**: Specialized agents for high-fidelity HTML, CSS, and JavaScript development.

### 🔗 Robust Ecosystem
- **Secure Authentication**: Enterprise-grade JWT-based authentication with OTP (One-Time Password) verification and secure password management.
- **Ephemeral Code Sharing**: Share snippets with unique, expiring links powered by **Redis** for secure, temporary collaboration.
- **Polyglot Support**: Syntax highlighting and execution simulation for 20+ languages including Python, Rust, Go, Swift, and more.
- **Dynamic IDE Experience**: Fully responsive interface featuring the Ace Editor for a professional, desktop-grade coding experience in the browser.

---

## 🛠️ Technical Stack

- **Frontend**: React, Vite, Bootstrap, Ace Editor
- **Backend Services**:
  - **AI Engine**: Flask (Python), LangChain, OpenRouter (Llama 3), Google Gemini
  - **Auth Service**: Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt
  - **Sharing Service**: Flask, Redis (Ephermal Storage)
- **DevOps/Tools**: Python-dotenv, CORS, Postman (Testing)

---

## 🏗️ Architecture Overview

CodeAgentix operates on a distributed microservices architecture:
1. **Frontend (Port 3000)**: React-based UI that communicates with various backends.
2. **Auth Backend (Port 5000)**: Manages users, OTPs, and JWT issue.
3. **AI Backend (Port 5001)**: Orchestrates AI agents and execution simulation.
4. **Sharing Backend (Port 5002)**: Handles ephemeral code storage using Redis.

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (3.9+)
- MongoDB & Redis instances (Local or Cloud)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dharmendra2567/CodeAgentix-AI-Code-Studio
   cd CodeAgentix-AI-Code-Studio
   ```

2. **Configure Environment**:
   Create `.env` files in `Backend/Genai`, `Backend/Login`, and `Frontend` based on provided examples.
   ```env
   # Backend/Genai/.env
   OPENROUTER_API_KEY="your_key"
   JWT_SECRET="your_secret"
   ```

3. **Run Backends**:
   ```bash
   # Start Auth Service (Port 5000)
   cd Backend/Login && npm start

   # Start AI Service (Port 5001)
   cd Backend/Genai && python app.py

   # Start Sharing Service (Port 5002)
   cd Backend/TempFile && python app.py
   ```

4. **Run Frontend**:
   ```bash
   cd Frontend && npm run dev
   ```

---

## 🔮 Future Roadmap

We are constantly evolving. Here is what's coming next:
- [ ] **Dockerized Code Execution**: Move from AI-simulated output to real-time containerized code execution.
- [ ] **Real-time Collaboration**: Live "Google Docs" style collaborative coding sessions using WebSockets.
- [ ] **AI-Driven Unit Testing**: Automatic generation of test suites for every snippet generated.
- [ ] **VS Code Extension**: A bridge to bring CodeAgentix's multi-agent intelligence directly into your local IDE.
- [ ] **Semantic Code Search**: Search through codebases using natural language.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Developed with ❤️ by [Dharmendra](https://github.com/Dharmendra2567)**
