const { ChatOpenAI } = require("@langchain/openai");
const prompts = require("./aiPrompts");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

const llm = new ChatOpenAI({
    modelName: "google/gemini-2.0-flash-001",
    temperature: 0,
    openAIApiKey: OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": "http://localhost",
            "X-Title": "CodeAgentix-AI"
        }
    }
});

// High-precision refiner model (Free & State-of-the-art 70B)
const llmRefiner = new ChatOpenAI({
    modelName: "meta-llama/llama-3.3-70b-instruct:free",
    temperature: 0,
    openAIApiKey: OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": "http://localhost",
            "X-Title": "CodeAgentix-AI-Refiner"
        }
    }
});

// Robust fallback refiner (Instant availability & High reliability)
const llmRefinerFallback = new ChatOpenAI({
    modelName: "openrouter/free",
    temperature: 0,
    openAIApiKey: OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": "http://localhost",
            "X-Title": "CodeAgentix-AI-Refiner-Fallback"
        }
    }
});

const validLanguages = new Set([
    "python", "javascript", "rust", "mongodb", "swift", "ruby", "dart",
    "perl", "scala", "julia", "go", "java", "cpp", "csharp", "c",
    "sql", "typescript", "kotlin", "verilog",
]);

async function streamGeneratedCode(problemDescription, language, res) {
    try {
        const instruction = prompts.generateInstruction;
        const promptTemplate = prompts.generateCodePrompt
            .replace("{problem_description}", problemDescription)
            .replace(/{language}/g, language);

        const inputText = `${instruction}\n\n${promptTemplate}`;

        console.log(`Streaming ${language} code generation...`);
        const stream = await llm.stream(inputText);
        for await (const chunk of stream) {
            res.write(chunk.content);
        }
        res.end();
    } catch (error) {
        console.error("Error streaming generated code:", error);
        res.status(500).end("Error: Unable to generate code.");
    }
}

async function streamRefactorCode(code, language, output, problemDescription, res) {
    try {
        let refactorContent;
        if (problemDescription) {
            refactorContent = prompts.refactorCodePromptUser
                .replace("{code}", code)
                .replace("{language}", language)
                .replace("{problem_description}", problemDescription)
                .replace("{output}", output);
        } else {
            refactorContent = prompts.refactorCodePrompt
                .replace("{code}", code)
                .replace("{language}", language)
                .replace("{output}", output);
        }

        const instruction = prompts.refactorInstruction;
        const inputText = `${instruction}\n\n${refactorContent}`;

        console.log(`Streaming ${language} code refactoring...`);
        const stream = await llm.stream(inputText);
        for await (const chunk of stream) {
            res.write(chunk.content);
        }
        res.end();
    } catch (error) {
        console.error("Error streaming refactored code:", error);
        res.status(500).end("Error: Unable to refactor code.");
    }
}

async function streamHtmlCssJsGenerate(prompt, type, htmlContent, cssContent, res) {
    try {
        let formattedPrompt;
        let instruction;
        if (type === "html") {
            formattedPrompt = prompts.htmlPrompt.replace("{prompt}", prompt);
            instruction = prompts.htmlGenerateInstruction;
        } else if (type === "css") {
            formattedPrompt = prompts.cssPrompt
                .replace("{html_content}", htmlContent)
                .replace("{project_description}", prompt);
            instruction = prompts.cssGenerateInstruction;
        } else {
            formattedPrompt = prompts.jsPrompt
                .replace("{html_content}", htmlContent)
                .replace("{css_content}", cssContent)
                .replace("{project_description}", prompt);
            instruction = prompts.jsGenerateInstruction;
        }

        const inputText = `${instruction}\n\n${formattedPrompt}`;
        const stream = await llm.stream(inputText);
        for await (const chunk of stream) {
            res.write(chunk.content);
        }
        res.end();
    } catch (error) {
        console.error(`Error streaming total ${type}:`, error);
        res.status(500).end(`Error: ${error.message}`);
    }
}

async function getGeneratedCode(problemDescription, language) {
    try {
        const instruction = prompts.generateInstruction;
        const promptTemplate = prompts.generateCodePrompt
            .replace("{problem_description}", problemDescription)
            .replace(/{language}/g, language);

        const inputText = `${instruction}\n\n${promptTemplate}`;

        console.log(`Generating ${language} code...`);
        const response = await llm.invoke(inputText);
        return response.content.trim();
    } catch (error) {
        console.error("Error generating code:", error);
        return "Error: Unable to generate code.";
    }
}

async function refactorCode(code, language, output, problemDescription = null) {
    try {
        let refactorContent;
        if (problemDescription) {
            refactorContent = prompts.refactorCodePromptUser
                .replace("{code}", code)
                .replace("{language}", language)
                .replace("{problem_description}", problemDescription)
                .replace("{output}", output);
        } else {
            refactorContent = prompts.refactorCodePrompt
                .replace("{code}", code)
                .replace("{language}", language)
                .replace("{output}", output);
        }

        const instruction = prompts.refactorInstruction;
        const inputText = `${instruction}\n\n${refactorContent}`;

        console.log(`Refactoring ${language} code...`);
        const response = await llm.invoke(inputText);
        return response.content.trim();
    } catch (error) {
        console.error("Error refactoring code:", error);
        return "Error: Unable to refactor code.";
    }
}

async function generateHtml(prompt) {
    const formattedPrompt = prompts.htmlPrompt.replace("{prompt}", prompt);
    const inputText = `${prompts.htmlGenerateInstruction}\n\n${formattedPrompt}`;
    const response = await llm.invoke(inputText);
    return response.content.trim();
}

async function generateCss(htmlContent, projectDescription) {
    const formattedPrompt = prompts.cssPrompt
        .replace("{html_content}", htmlContent)
        .replace("{project_description}", projectDescription);
    const inputText = `${prompts.cssGenerateInstruction}\n\n${formattedPrompt}`;
    const response = await llm.invoke(inputText);
    return response.content.trim();
}

async function generateJs(htmlContent, cssContent, projectDescription) {
    const formattedPrompt = prompts.jsPrompt
        .replace("{html_content}", htmlContent)
        .replace("{css_content}", cssContent)
        .replace("{project_description}", projectDescription);
    const inputText = `${prompts.jsGenerateInstruction}\n\n${formattedPrompt}`;
    const response = await llm.invoke(inputText);
    return response.content.trim();
}

async function refactorCodeHtmlCssJs(language, promptTemplate, params, problemDescription = null) {
    try {
        let formattedPrompt = promptTemplate;
        for (const [key, value] of Object.entries(params)) {
            formattedPrompt = formattedPrompt.replace(`{${key}}`, value);
        }
        if (problemDescription) {
            formattedPrompt = formattedPrompt.replace("{problem_description}", problemDescription);
        }

        const instruction = prompts.refactorInstruction;
        const inputText = `${instruction}\n\n${formattedPrompt}`;
        const response = await llm.invoke(inputText);
        return response.content.trim();
    } catch (error) {
        console.error(`Error refactoring ${language}:`, error);
        return `Error: ${error.message}`;
    }
}

async function streamAiChat(code, language, output, type, res) {
    try {
        const typeMap = {
            explain: { instruction: prompts.explainInstruction, task: "Explain how this code works." },
            debug: { instruction: prompts.debugInstruction, task: "Find bugs and suggest fixes for this code." },
            optimize: { instruction: prompts.optimizeInstruction, task: "Optimize this code for performance." },
            docs: { instruction: prompts.docsInstruction, task: "Generate comprehensive documentation for this code." },
            complexity: { instruction: prompts.complexityInstruction, task: "Calculate time and space complexity." }
        };

        const config = typeMap[type] || typeMap.explain;
        const chatContent = prompts.chatPrompt
            .replace("{code}", code)
            .replace("{language}", language)
            .replace("{output}", output)
            .replace("{task_description}", config.task);

        const inputText = `${config.instruction}\n\n${chatContent}`;

        console.log(`Step 1: Drafting AI response for ${type}...`);
        const draftResponse = await llm.invoke(inputText);
        const draftText = draftResponse.content;

        console.log(`Step 2: Refining AI response for ${type}...`);
        const refinementPrompt = `${prompts.refineInstruction}\n\nORIGINAL DRAFT:\n${draftText}\n\nCONTEXT CODE:\n${code}`;

        try {
            console.log("Attempting refinement with primary model (Llama 3.3 70B)...");
            const stream = await llmRefiner.stream(refinementPrompt);
            for await (const chunk of stream) {
                res.write(chunk.content);
            }
        } catch (refineError) {
            console.warn(`Primary refinement failed (Error: ${refineError.message}). Falling back to robust router...`);
            const stream = await llmRefinerFallback.stream(refinementPrompt);
            for await (const chunk of stream) {
                res.write(chunk.content);
            }
        }
        res.end();
    } catch (error) {
        console.error(`Error in Precise AI Chat (${type}):`, error);
        res.status(500).end(`Error: ${error.message}`);
    }
}

module.exports = {
    getGeneratedCode,
    refactorCode,
    generateHtml,
    generateCss,
    generateJs,
    streamGeneratedCode,
    streamRefactorCode,
    streamHtmlCssJsGenerate,
    refactorCodeHtmlCssJs,
    streamAiChat,
    prompts
};
