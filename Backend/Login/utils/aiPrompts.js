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
    refactorCodePromptUser,
    explainInstruction: `ACT AS A SENIOR CODE ARCHITECT AND TECHNICAL WRITER. PROVIDE A CLEAR, STEP-BY-STEP EXPLANATION OF THE PROVIDED CODE logic. USE MARKDOWN. BE PRECISE.`,
    debugInstruction: `ACT AS A SENIOR DEBUGGER. IDENTIFY LOGICAL ERRORS, POTENTIAL BUGS, AND EDGE CASES IN THE PROVIDED CODE. PROVIDE FIXES.`,
    optimizeInstruction: `ACT AS A PERFORMANCE ENGINEER. ANALYZE TIME AND SPACE COMPLEXITY AND PROVIDE AN OPTIMIZED VERSION OF THE CODE.`,
    docsInstruction: `ACT AS A DOCUMENTATION SPECIALIST. GENERATE PROFESSIONAL DOCSTRINGS, COMMENTS, AND README SNIPPETS FOR THE CODE.`,
    complexityInstruction: `ACT AS A COMPUTER SCIENCE PROFESSOR. ANALYZE THE CODE AND PROVIDE A DETAILED BIG-O COMPLEXITY REPORT (TIME & SPACE).`,
    refineInstruction: `ACT AS A CRITICAL EDITOR. REFACTOR THE PROVIDED AI EXPLANATION TO BE MORE PRECISE, CONCISE, AND TECHNICALLY ACCURATE. REMOVE FLUFF.`,
    chatPrompt: `CODE CONTEXT:
\`\`\`{language}
{code}
\`\`\`

PREVIOUS OUTPUT:
{output}

TASK: {task_description}

INSTRUCTION: Provide a comprehensive and professional response.`
};
