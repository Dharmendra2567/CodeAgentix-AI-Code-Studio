# CodeX: AI-Powered Online IDE with Multi-Agent Collaboration

## Problem Statement

Traditional online IDEs often lack intelligent code assistance features that can understand programming context, generate code, debug errors, and refactor solutions effectively. Developers need tools that can not only execute code but also provide intelligent suggestions, fix bugs, and optimize implementations across multiple programming languages.

AI agents are perfectly suited for this use case because they can:
- Understand natural language descriptions of programming problems
- Generate syntactically correct code in multiple languages
- Analyze code execution and identify errors
- Provide intelligent refactoring suggestions
- Collaborate to handle different aspects of the development process

Multi-agent collaboration brings unique value by allowing specialized agents to focus on their areas of expertise (code generation, execution, refactoring) while working together to provide a comprehensive solution that exceeds what any single agent could accomplish alone.

## Project Description

This application is an AI-powered online IDE that leverages multiple AI agents to assist developers throughout the coding process. The system features:

1. **Code Generation Agent**: Uses Google Gemini to generate initial code solutions based on natural language problem descriptions
2. **Code Execution Agent**: Uses Google Gemini to analyze and execute code, providing output or error messages
3. **Code Refactoring Agent**: Uses OpenAI models to analyze and improve existing code based on outputs or specific requirements
4. **User Authentication System**: Secure JWT-based registration and login system
5. **Dynamic UI**: Language-specific editors with syntax highlighting and tailored interfaces

The agents operate in a collaborative workflow:
- The user provides a problem description and selects a programming language
- The Code Generation Agent creates an initial solution
- The Code Execution Agent runs the code and provides feedback
- The Code Refactoring Agent suggests improvements based on the output
- For web development (HTML/CSS/JS), specialized agents handle each layer of the frontend stack

## Tools, Libraries, and Frameworks Used

- **LangChain**: Framework for building LLM-powered applications and managing multi-agent workflows
- **Google Gemini API**: For code generation and execution analysis
- **OpenAI API**: For code refactoring tasks
- **Flask**: Web framework for building the backend server
- **Flask-CORS**: Handling cross-origin requests
- **JWT**: For authentication and authorization
- **Python-dotenv**: For environment variable management
- **Ace Editor**: For code editing with syntax highlighting
- **Bootstrap**: For responsive UI components

## LLM Selection

### Ideal LLM Models:
- **GPT-4** (OpenAI): Used for code refactoring tasks due to its superior reasoning capabilities and precise understanding of code structure and patterns
- **Gemini 1.5 Pro** (Google): Used for code generation and execution analysis due to its strong performance in code-related tasks and large context window

### Free-tier LLM Options:
- **GPT-3.5 Turbo** (OpenAI): A capable alternative for code refactoring that provides good performance at lower cost
- **Gemini Pro** (Google): Available through Google's free tier with generous usage limits, suitable for code generation tasks

The choice of using both Gemini and OpenAI models represents a strategic decision to leverage each model's strengths:
- Gemini excels at code generation and broad language support
- OpenAI models provide more precise refactoring capabilities
- This multi-model approach ensures higher quality results than using a single provider

## Code and Deployment

### GitHub Repository
[Link to GitHub Repository](https://github.com/Dharmendra2567/Codex-AI_Agent_online_ide)

### Demo Link
[Not Deployed Yet](https://your-demo-link.vercel.app)



### Setup and Run Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dharmendra2567/Codex-AI_Agent_online_ide
   cd Codex-AI_Agent_online_ide
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your API keys:
   ```
   GEMINI_MODEL="models/gemini-pro"
   GEMINI_MODEL_1="models/gemini-pro"
   JWT_SECRET="your-jwt-secret"
   OPENAI_API_KEY="your-openai-api-key"
   ```

4. **Run the application**:
   ```bash
   cd backend/GenAi
   python app.py    //it starts at http://localhost:5001

    cd backend/login
    npm start     //it start at http://localhost:5000

    cd backend/Tempfile
    python app.py    //it start at http://localhost: 5002d
   cd frontend
   npm run dev    //it starts at http://localhost: 3000
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:5001`

### Usage
1. Register for a new account or login with existing credentials
2. Select your programming language from the dashboard
3. Describe your coding problem or paste existing code
4. Use the generate, execute, and refactor features as needed
5. For web development, use the HTML/CSS/JS specific tools

The application provides a seamless coding experience with AI assistance at every step, making it easier to write, debug, and improve code across multiple programming languages.

## Frontend Implementation

The frontend includes:

1. **User Authentication**: Registration and login forms with JWT token management
2. **Language Selection Dashboard**: Buttons for all supported programming languages
3. **Dynamic Editors**: Language-specific code editors with syntax highlighting
4. **Real-time Output Display**: Area for code execution results
5. **AI Action Buttons**: Generate, Execute, and Refactor functionality

### Key Frontend Features:

- Responsive design that works on desktop and mobile devices
- Syntax highlighting for all supported programming languages
- Real-time collaboration features (if implemented)
- Dark/light mode toggle
- Code formatting and linting indicators
- File management for multi-file projects

### Authentication Flow:

1. Users register with email and password
2. JWT tokens are issued upon successful authentication
3. All API requests include the JWT token in the Authorization header
4. Tokens are validated on the server for each protected endpoint
5. Session management with token refresh capabilities

The application provides a comprehensive coding environment that combines the power of multiple AI agents with a user-friendly interface for an enhanced development experience.