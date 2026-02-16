const languagesPrompts = {
    "python": `SYSTEM_TASK: ACT AS A HIGH-PRECISION PYTHON RUNTIME.
INPUT_CODE:
\`\`\`python
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "javascript": `SYSTEM_TASK: ACT AS A HIGH-PRECISION NODE.JS RUNTIME.
INPUT_CODE:
\`\`\`javascript
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "cpp": `SYSTEM_TASK: ACT AS A HIGH-PRECISION C++ RUNTIME.
INPUT_CODE:
\`\`\`cpp
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "c": `SYSTEM_TASK: ACT AS A HIGH-PRECISION C RUNTIME.
INPUT_CODE:
\`\`\`c
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "java": `SYSTEM_TASK: ACT AS A HIGH-PRECISION JAVA RUNTIME.
INPUT_CODE:
\`\`\`java
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "csharp": `SYSTEM_TASK: ACT AS A HIGH-PRECISION .NET RUNTIME.
INPUT_CODE:
\`\`\`csharp
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "rust": `SYSTEM_TASK: ACT AS A HIGH-PRECISION RUST RUNTIME.
INPUT_CODE:
\`\`\`rust
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "go": `SYSTEM_TASK: ACT AS A HIGH-PRECISION GO RUNTIME.
INPUT_CODE:
\`\`\`go
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "sql": `SYSTEM_TASK: ACT AS A HIGH-PRECISION SQL ENGINE.
INPUT_CODE:
\`\`\`sql
{code}
\`\`\`
CONSTRAINT: OUTPUT RESULTS AS A RAW TEXT TABLE. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "mongodb": `SYSTEM_TASK: ACT AS A HIGH-PRECISION MONGODB SHELL.
INPUT_CODE:
\`\`\`javascript
{code}
\`\`\`
CONSTRAINT: OUTPUT RESULTS AS RAW JSON. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "swift": `SYSTEM_TASK: ACT AS A HIGH-PRECISION SWIFT RUNTIME.
INPUT_CODE:
\`\`\`swift
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "ruby": `SYSTEM_TASK: ACT AS A HIGH-PRECISION RUBY RUNTIME.
INPUT_CODE:
\`\`\`ruby
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "typescript": `SYSTEM_TASK: ACT AS A HIGH-PRECISION TYPESCRIPT RUNTIME.
INPUT_CODE:
\`\`\`typescript
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "dart": `SYSTEM_TASK: ACT AS A HIGH-PRECISION DART RUNTIME.
INPUT_CODE:
\`\`\`dart
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "kotlin": `SYSTEM_TASK: ACT AS A HIGH-PRECISION KOTLIN RUNTIME.
INPUT_CODE:
\`\`\`kotlin
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "perl": `SYSTEM_TASK: ACT AS A HIGH-PRECISION PERL RUNTIME.
INPUT_CODE:
\`\`\`perl
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "scala": `SYSTEM_TASK: ACT AS A HIGH-PRECISION SCALA RUNTIME.
INPUT_CODE:
\`\`\`scala
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "julia": `SYSTEM_TASK: ACT AS A HIGH-PRECISION JULIA RUNTIME.
INPUT_CODE:
\`\`\`julia
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE TERMINAL STDOUT/STDERR. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
    "verilog": `SYSTEM_TASK: ACT AS A HIGH-PRECISION VERILOG SIMULATOR.
INPUT_CODE:
\`\`\`verilog
{code}
\`\`\`
CONSTRAINT: OUTPUT ONLY THE SIMULATION RESULTS. DO NOT ADD NOTES. DO NOT HALLUCINATE ERRORS. IF VALID, RUN IT.
`,
};

const compilerInstruction = `ZERO_TOLERANCE_MODE: OUTPUT ONLY THE RAW TERMINAL TEXT. NO MARKDOWN. NO EXPLANATIONS. NO CODE RE-STATEMENT.`;
const runtimeInstruction = `ACT AS A HIGH-AVAILABILITY SYSTEM KERNEL. OUTPUT ONLY THE LITERAL STDOUT OF THE PROGRAM.`;
const refactorInstruction = `ACT AS A SENIOR CODE ARCHITECT. REFACTOR THE PROVIDED CODE TO BE MORE ROBUST AND PERFORMANT. OUTPUT ONLY CODE.`;
const generateInstruction = `ACT AS A SENIOR SOFTWARE ENGINEER. GENERATE PRODUCTION-READY CODE FOR THE GIVEN PROBLEM. OUTPUT ONLY CODE.`;

const htmlGenerateInstruction = `ACT AS A SENIOR FRONTEND DEVELOPER. GENERATE SEMANTIC HTML5. OUTPUT ONLY CODE.`;
const cssGenerateInstruction = `ACT AS A SENIOR CSS ARCHITECT. GENERATE RESPONSIVE MODERN CSS. OUTPUT ONLY CODE.`;
const jsGenerateInstruction = `ACT AS A SENIOR JAVASCRIPT DEVELOPER. GENERATE EFFICIENT JS. OUTPUT ONLY CODE.`;

const htmlPrompt = `TASK: Generate specific HTML for: {prompt}. Rules: No head/body, no inline scripts/styles. Output ONLY code.`;
const cssPrompt = `TASK: Generate CSS for: {project_description}. HTML Context: {html_content}. Rules: Responsive only. Output ONLY code.`;
const jsPrompt = `TASK: Generate JS for: {project_description}. HTML/CSS Context: {html_content} / {css_content}. Rules: ES6+. Output ONLY code.`;

const refactorHtmlPrompt = `TASK: Refactor this HTML: {html_content}`;
const refactorCssPrompt = `TASK: Refactor this CSS (Context HTML): {html_content} / CSS: {css_content}`;
const refactorJsPrompt = `TASK: Refactor this JS (Context HTML/CSS): {html_content} / {css_content} / JS: {js_content}`;

const refactorHtmlPromptUser = `TASK: Refactor this HTML to fix: {problem_description}. HTML: {html_content}`;
const refactorCssPromptUser = `TASK: Refactor this CSS to fix: {problem_description}. HTML: {html_content} CSS: {css_content}`;
const refactorJsPromptUser = `TASK: Refactor this JS to fix: {problem_description}. HTML: {html_content} CSS: {css_content} JS: {js_content}`;

const generateCodePrompt = `TASK: Solve in {language}: {problem_description}. Output ONLY code. No markdown.`;

const refactorCodePrompt = `TASK: Optimize {language} code: {code}. Previous Output: {output}. Output ONLY code.`;

const refactorCodePromptUser = `TASK: Refactor {language} code for: {problem_description}. Code: {code}. Previous Output: {output}. Output ONLY code.`;

module.exports = {
    languagesPrompts,
    compilerInstruction,
    runtimeInstruction,
    refactorInstruction,
    generateInstruction,
    htmlGenerateInstruction,
    cssGenerateInstruction,
    jsGenerateInstruction,
    htmlPrompt,
    cssPrompt,
    jsPrompt,
    refactorHtmlPrompt,
    refactorCssPrompt,
    refactorJsPrompt,
    refactorHtmlPromptUser,
    refactorCssPromptUser,
    refactorJsPromptUser,
    generateCodePrompt,
    refactorCodePrompt,
    refactorCodePromptUser
};
