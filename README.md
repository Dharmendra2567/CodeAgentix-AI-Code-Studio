# 🧠 CodeAgentix AI Studio

### *The Intelligent Multi-Agent IDE for the Modern Developer*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/Dharmendra2567/CodeAgentix-AI-Code-Studio)
![Build: Passing](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Aesthetics: Premium](https://img.shields.io/badge/aesthetics-premium-ff69b4.svg)

**CodeAgentix AI Studio** is a state-of-the-art online AI based online code compiler that leverages a collaborative multi-agent AI architecture. It offers a "Perfect Working" experience with high-availability AI, robust ephemeral sharing, and a stunning premium design system.

### 🌐 [Live Demo](https://your-frontend.vercel.app) | 📡 [API Status](https://your-backend.onrender.com)

---

## 🚀 Key Features

### 🤖 Advanced AI Assistant (Dual-Model Precision)
Unleash the power of high-end LLMs directly in your editor. Our unique **Redundant Precision Pipeline** ensures you never face a downtime error.
- **Draft & Refine Logic**: Every request is drafted by **Google Gemini 2.0 Flash** and refined by **Llama 3.3 70B** for technical perfection.
- **100% Availability**: Built-in auto-fallback to the **OpenRouter Free Router** guarantees response generation even during peak rate-limiting periods.
- **Specialized AI Actions**:
  - **Explain**: Step-by-step logic breakdown.
  - **Debug**: Real-time logical error detection and patching.
  - **Optimize**: Performance assessment and Big-O complexity reports.
  - **Docs**: Instant generation of professional docstrings and comments.
-   **Floating Brain Menu**: Access AI power with a sleek, hover-reveal interface.
-   **Real-time Chat Sidebar**: Consult your AI assistant side-by-side with your code.

### 🔗 Robust Ephemeral Sharing
Share your code securely without worrying about stale links or server instability.
- **MongoDB-Powered Migration**: We've migrated snippet storage from Redis to **MongoDB** for 100% reliability.
- **Auto-Expiration**: Utilizing MongoDB **TTL (Time-To-Live) indices**, links automatically disappear after your chosen duration (10 mins to 1 week).
- **One-Click Sharing**: Generate and copy unique share URLs instantly.

### 🎨 Premium Design System
Aesthetics that inspire productivity.
- **Uniform Gradient Theme**: A cohesive visual language featuring vibrant, high-end gradients across all UI elements.
- **Micro-Animations**: Subtle scaling, brightness transitions, and responsive hover effects for a modern, "alive" feel.
- **Full Responsiveness**: Optimized for Desktop, Tablet, and Mobile viewport sizes.
- **Monaco Editor Support**: Leveraging the power of VS Code's core editor in the browser with advanced syntax highlighting for 20+ languages.

---

## 🏗️ Project Architecture (Monorepo)

The project is structured as a streamlined, high-performance monorepo:

```markdown
CodeAgentix/
├── Frontend/             # React + Vite Studio (Standard UI & UX)
│   └── src/
│       ├── components/    # Standardized Premium Components
│       └── utils/         # Constants and Logic
├── Backend/Login/         # Consolidated Node.js Production Server
│   ├── models/            # Mongoose Models (User, SharedCode)
│   ├── utils/             # AI, Sharing, and Execution logic
│   └── server.js          # Main Entry Point (Express)
└── README.md              # Master Documentation
```

---

## 🛠️ Technical Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Monaco Editor, Framer Motion
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **AI Engine**: LangChain, OpenRouter (Llama 3.3 70B, Gemini 2.0 Flash)
- **Deployment**: Render (Backend), Vercel (Frontend)

---

## 🏁 Installation & Setup

### Prerequisites
-   **Node.js** (v18+)
-   **MongoDB** (Atlas or Local)
-   **OpenRouter API Key** (for AI features)

### Local Development

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/Dharmendra2567/CodeAgentix-AI-Code-Studio
    cd CodeAgentix-AI-Code-Studio
    ```

2.  **Setup Backend**:
    ```bash
    cd Backend/Login
    npm install
    # Create .env with: MONGO_URI, JWT_SECRET, OPENROUTER_API_KEY
    npm start
    ```

3.  **Setup Frontend**:
    ```bash
    cd Frontend
    npm install
    # Create .env with: VITE_BACKEND_API_URL=http://localhost:5000
    npm run dev
    ```

---

## 🚀 Deployment (Cloud)

### Backend (Render.com)
- **Root Directory**: `Backend/Login`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Env**: Add `MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`.

### Frontend (Vercel)
- **Root Directory**: `Frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Env**: `VITE_BACKEND_API_URL` (Set to your Render URL).

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
**Developed with ❤️ for the Developer Community by [Dharmendra](https://github.com/Dharmendra2567)**
