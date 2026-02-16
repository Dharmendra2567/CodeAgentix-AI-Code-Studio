const { ChatOpenAI } = require("@langchain/openai");
const prompts = require("./aiPrompts");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.warn("WARNING: OPENROUTER_API_KEY not found in environment variables.");
}

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

function utcTimeReference() {
    const now = new Date();
    return now.toUTCString().replace("GMT", "UTC");
}

const validLanguages = new Set([
    "python", "javascript", "rust", "mongodb", "swift", "ruby", "dart",
    "perl", "scala", "julia", "go", "java", "cpp", "csharp", "c",
    "sql", "typescript", "kotlin", "verilog",
]);

async function getGeneratedCode(problemDescription, language) {
    try {
        if (!validLanguages.has(language)) {
            return "Error: Unsupported language.";
        }

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

async function getOutput(code, language, userInput = null) {
    try {
        if (!prompts.languagesPrompts[language]) {
            return "Error: Language not supported.";
        }

        const instruction = prompts.runtimeInstruction;
        const promptTemplate = prompts.languagesPrompts[language]
            .replace("{code}", code);

        let inputPrompt = userInput
            ? `\n\nUSER INPUTS:\n${userInput}\n`
            : "";

        const inputText = `${instruction}\n\n${promptTemplate}${inputPrompt}`;

        console.log(`Simulating execution for ${language}...`);
        const response = await llm.invoke(inputText);
        return response.content.trim();
    } catch (error) {
        console.error("Error in getOutput:", error);
        return `Error: Unable to process the code. ${error.message}`;
    }
}

async function refactorCode(code, language, output, problemDescription = null) {
    try {
        if (!validLanguages.has(language)) {
            return "Error: Unsupported language.";
        }

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
    const formattedPrompt = prompts.htmlPrompt
        .replace("{prompt}", prompt);
    const inputText = `${prompts.htmlGenerateInstruction}\n\n${formattedPrompt}`;

    console.log("Generating HTML...");
    const response = await llm.invoke(inputText);
    return response.content.trim();
}

async function generateCss(htmlContent, projectDescription) {
    const formattedPrompt = prompts.cssPrompt
        .replace("{html_content}", htmlContent)
        .replace("{project_description}", projectDescription);
    const inputText = `${prompts.cssGenerateInstruction}\n\n${formattedPrompt}`;

    console.log("Generating CSS...");
    const response = await llm.invoke(inputText);
    return response.content.trim();
}

async function generateJs(htmlContent, cssContent, projectDescription) {
    const formattedPrompt = prompts.jsPrompt
        .replace("{html_content}", htmlContent)
        .replace("{css_content}", cssContent)
        .replace("{project_description}", projectDescription);
    const inputText = `${prompts.jsGenerateInstruction}\n\n${formattedPrompt}`;

    console.log("Generating JS...");
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

        console.log(`Refactoring HTML/CSS/JS (${language})...`);
        const response = await llm.invoke(inputText);
        return response.content.trim();
    } catch (error) {
        console.error(`Error refactoring ${language}:`, error);
        return `Error: ${error.message}`;
    }
}

module.exports = {
    getGeneratedCode,
    getOutput,
    refactorCode,
    generateHtml,
    generateCss,
    generateJs,
    refactorCodeHtmlCssJs,
    prompts // Export prompts for accessibility
};
