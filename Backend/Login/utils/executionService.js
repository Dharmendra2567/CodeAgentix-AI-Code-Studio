const axios = require("axios");

const WANDBOX_API_URL = "https://wandbox.org/api/compile.json";

/**
 * Stable Mapping of languages to Wandbox compiler IDs.
 * Verified via https://wandbox.org/api/list.json
 */
const languageMapping = {
    "python": { compiler: "cpython-3.14.0", file: "prog.py" },
    "python3": { compiler: "cpython-3.14.0", file: "prog.py" },
    "javascript": { compiler: "nodejs-20.17.0", file: "prog.js" },
    "node": { compiler: "nodejs-20.17.0", file: "prog.js" },
    "cpp": { compiler: "gcc-head", file: "prog.cpp" },
    "c": { compiler: "gcc-head-c", file: "prog.c" },
    "java": { compiler: "openjdk-jdk-22+36", file: "Main.java" },
    "rust": { compiler: "rust-1.82.0", file: "prog.rs" },
    "go": { compiler: "go-1.23.2", file: "prog.go" },
    "ruby": { compiler: "ruby-3.4.1", file: "prog.rb" },
    "swift": { compiler: "swift-6.0.1", file: "prog.swift" },
    "typescript": { compiler: "typescript-5.6.2", file: "prog.ts" },
    "kotlin": { compiler: "kotlin-1.9.24", file: "prog.kt" },
};

async function executeCode(code, language, userInput = "") {
    try {
        const config = languageMapping[language.toLowerCase()];

        if (!config) {
            return `Error: Real execution for '${language}' is coming soon. Please use Python, C++, C, or Java for now.`;
        }

        /**
         * The most stable Wandbox payload uses 'code' as the entry point
         * and 'codes' to specify filenames (crucial for Java).
         */
        const payload = {
            compiler: config.compiler,
            code: code,
            stdin: userInput || "",
            save: false,
            codes: [{
                file: config.file,
                code: code
            }]
        };

        console.log(`Executing ${language} anonymously via Wandbox (${config.compiler})...`);
        const response = await axios.post(WANDBOX_API_URL, payload);
        const data = response.data;

        let result = "";

        // Priority 1: Compiler messages (errors or warnings)
        if (data.compiler_message) {
            result += data.compiler_message;
        } else if (data.compiler_error) {
            result += data.compiler_error;
        }

        // Priority 2: Program output
        if (data.program_message) {
            result += data.program_message;
        } else if (data.program_output) {
            result += data.program_output;
        }

        // Priority 3: Runtime errors
        if (data.program_error && !data.program_message) {
            result += "\n" + data.program_error;
        }

        return result || "--- Program execution finished (no output) ---";
    } catch (error) {
        console.error("Execution Error:", error.message);
        return `Execution Error: ${error.message}`;
    }
}

module.exports = {
    executeCode
};
