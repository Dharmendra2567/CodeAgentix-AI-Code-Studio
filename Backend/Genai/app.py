import os
import re
import jwt
from google.genai import types
from dotenv import load_dotenv
from flask import (
    Flask,
    Response,
    jsonify,
    render_template,
    request,
    stream_with_context,
)
from flask_cors import CORS
from functools import wraps
from datetime import datetime, timezone
import json
from prompts import *

# LangChain imports
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor

valid_languages = {
    "python",
    "javascript",
    "rust",
    "mongodb",
    "swift",
    "ruby",
    "dart",
    "perl",
    "scala",
    "julia",
    "go",
    "java",
    "cpp",
    "csharp",
    "c",
    "sql",
    "typescript",
    "kotlin",
    "verilog",
}

app = Flask(__name__)

# Configure CORS to allow requests from frontend
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

load_dotenv()

CODE_REGEX = r"```(?:\w+\n)?(.*?)```"

SECRET_KEY = os.getenv("JWT_SECRET")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")

if not OPENROUTER_API_KEY:
    print("CRITICAL ERROR: OPENROUTER_API_KEY not found in environment variables or .env file.")
    print("Please add 'OPENROUTER_API_KEY=your_key_here' to Backend/Genai/.env")
    # We'll allow the error to propagate or stop here to avoid the crash later
else:
    print(f"OPENROUTER_API_KEY found (starts with: {OPENROUTER_API_KEY[:5]}...)")

# OpenRouter LLM setup
try:
    llm = ChatOpenAI(
        model="meta-llama/llama-3-8b-instruct",
        temperature=0,
        api_key=OPENROUTER_API_KEY,
        openai_api_base="https://openrouter.ai/api/v1",
        default_headers={
            "HTTP-Referer": "http://localhost",
            "X-Title": "LangChain-Agent"
        }
    )
except Exception as e:
    print(f"Error initializing ChatOpenAI: {e}")
    llm = None

@tool
def calculator(query: str) -> str:
    """Perform basic arithmetic calculations."""
    try:
        # Note: In a production environment, use a safer eval or a math library
        return str(eval(query))
    except:
        return "Error in calculation"

tools_set = [calculator]

agent_prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a strictly deterministic code execution and generation engine.
Your output MUST contain ONLY the direct result of the requested task (code output simulation or code generation).
- NO conversational filler.
- NO markdown code blocks (```) unless they are part of the actual simulated output.
- NO explanations.

EXAMPLES:
1. Task: Simulate Python code output for `print('hello')`
   Output: hello

2. Task: Generate Python code for "print hello"
   Output: print("hello")

3. Task: Analyze C++ code for errors.
   Output: (Only the error message or the execution result)"""),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])

agent = create_tool_calling_agent(llm, tools_set, agent_prompt)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools_set,
    verbose=True
)


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing!"}), 403

        try:
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS512"])
            request.user_data = decoded
        except jwt.InvalidTokenError as e:
            return jsonify({"message": "Invalid token!"}), 401

        return f(*args, **kwargs)

    return decorator


def get_generated_code(problem_description, language):
    try:
        if language not in valid_languages:
            return "Error: Unsupported language."

        instruction = generate_instruction.format(language=language)
        prompt_template = generate_code_prompt.format(
            problem_description=problem_description, language=language
        )
        
        input_text = f"{instruction}\n\nTASK: Generate the following code.\n{prompt_template}\n\nRAW CODE ONLY:"
        
        print(f"Generating {language} code...")
        # Use llm directly to avoid AgentExecutor's conversational overhead for this direct mapping task
        response = llm.invoke(input_text)
        return Response(response.content.strip(), mimetype="text/plain")

    except Exception as e:
        print(f"Error generating code: {e}")
        return ""


def get_output(code, language, user_input=None):
    try:
        if language in languages_prompts:
            prompt_template = languages_prompts[language].format(
                code=code, time=utc_time_reference()
            )
            instruction = compiler_instruction.format(language=language)
        else:
            return "Error: Language not supported."

        input_prompt = ""
        if user_input:
            input_prompt = f"\n\nPROVIDED USER INPUTS (to be used when the code requests input):\n{user_input}\n"
        else:
            input_prompt = "\n\nNO USER INPUTS PROVIDED."

        input_text = f"{instruction}\n\n{prompt_template}{input_prompt}\n\n" \
                     f"IMPORTANT: \n" \
                     f"1. PROVIDE ONLY THE TERMINAL OUTPUT (TEXT).\n" \
                     f"2. DO NOT INCLUDE THE SOURCE CODE OR EXPLAIN.\n" \
                     f"3. If the code requires user input and it is NOT provided or exhausted, return ONLY: value needed\n\n" \
                     f"TERMINAL OUTPUT:"
        
        print(f"Executing code output simulation for {language} with input: {user_input}...")
        # Use llm directly to avoid AgentExecutor's conversational overhead for this direct mapping task
        response = llm.invoke(input_text)
        return Response(response.content.strip(), mimetype="text/plain")
        
    except Exception as e:
        print(f"Error in get_output: {e}")
        return f"Error: Unable to process the code. {str(e)}"


def refactor_code(code, language, output, problem_description=None):
    try:
        if language not in valid_languages:
            return "Error: Unsupported language."

        if problem_description:
            refactor_content = refactor_code_prompt_user.format(
                code=code,
                language=language,
                problem_description=problem_description or "",
                output=output,
            )
        else:
            refactor_content = refactor_code_prompt.format(
                code=code, language=language, output=output
            )

        instruction = refactor_instruction.format(language=language)
        input_text = f"{instruction}\n\n{refactor_content}\n\nIMPORTANT: PROVIDE ONLY THE REFACTORED CODE. DO NOT EXPLAIN. DO NOT USE MARKDOWN CODE BLOCKS.\n\nREFACTORED CODE:"
        
        print(f"Refactoring {language} code...")
        response = llm.invoke(input_text)
        return Response(response.content.strip(), mimetype="text/plain")

    except Exception as e:
        print(f"Error refactoring code: {e}")
        return ""


def refactor_code_html_css_js(language, prompt, params, problem_description=None):
    try:
        if problem_description:
            formatted_prompt = prompt.format(
                **params, problem_description=problem_description
            )
        else:
            formatted_prompt = prompt.format(**params)

        instruction = refactor_instruction.format(language=language)
        input_text = f"{instruction}\n\n{formatted_prompt}\n\nIMPORTANT: PROVIDE ONLY THE REFACTORED CODE. DO NOT EXPLAIN. DO NOT USE MARKDOWN CODE BLOCKS.\n\nREFACTORED CODE:"
        
        print(f"Refactoring HTML/CSS/JS ({language})...")
        response = llm.invoke(input_text)
        return response.content.strip()
    except Exception as e:
        return f"Error: {e}"


def generate_html(prompt):
    formatted_prompt = html_prompt.format(prompt=prompt, time=utc_time_reference())
    input_text = f"{html_generate_instruction}\n\nTASK: Generate the following HTML code.\n{formatted_prompt}\n\nIMPORTANT: PROVIDE ONLY THE HTML CODE. DO NOT EXPLAIN. DO NOT USE MARKDOWN CODE BLOCKS.\n\nHTML CODE:"
    
    print("Generating HTML...")
    response = llm.invoke(input_text)
    return Response(response.content.strip(), mimetype="text/plain")


def generate_css(html_content, project_description):
    formatted_prompt = css_prompt.format(
        html_content=html_content,
        project_description=project_description,
        time=utc_time_reference(),
    )
    input_text = f"{css_generate_instruction}\n\nTASK: Generate the following CSS code for the provided HTML.\n{formatted_prompt}\n\nIMPORTANT: PROVIDE ONLY THE CSS CODE. DO NOT EXPLAIN. DO NOT USE MARKDOWN CODE BLOCKS.\n\nCSS CODE:"
    
    print("Generating CSS...")
    response = llm.invoke(input_text)
    return Response(response.content.strip(), mimetype="text/plain")


def generate_js(html_content, css_content, project_description):
    formatted_prompt = js_prompt.format(
        html_content=html_content,
        css_content=css_content,
        project_description=project_description,
        time=utc_time_reference(),
    )
    input_text = f"{js_generate_instruction}\n\nTASK: Generate the following JavaScript code for the provided HTML and CSS.\n{formatted_prompt}\n\nIMPORTANT: PROVIDE ONLY THE JAVASCRIPT CODE. DO NOT EXPLAIN. DO NOT USE MARKDOWN CODE BLOCKS.\n\nJAVASCRIPT CODE:"
    
    print("Generating JS...")
    response = llm.invoke(input_text)
    return Response(response.content.strip(), mimetype="text/plain")


def utc_time_reference():
    utc_now = datetime.now(timezone.utc)
    formatted_time = utc_now.strftime("%I:%M:%S %p on %B %d, %Y")
    return f"{formatted_time} UTC time zone"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/generate_code", methods=["POST"])
@token_required
def generate_code():
    try:
        problem_description = request.json["problem_description"]
        language = request.json["language"]

        return get_generated_code(problem_description, language)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/get-output", methods=["POST"])
def get_output_api():
    try:
        code = request.json["code"]
        language = request.json["language"]
        user_input = request.json.get("userInput")

        if not code or not language:
            return jsonify({"error": "Missing code or language"}), 400

        return get_output(code, language, user_input)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/refactor_code", methods=["POST"])
@token_required
def refactor_code_api():
    try:
        code = request.json["code"]
        language = request.json["language"]
        problem_description = request.json.get("problem_description")
        output = request.json["output"]

        if not code or not language:
            return jsonify({"error": "Missing code or language"}), 400

        if problem_description:
            return refactor_code(code, language, output, problem_description)
        else:
            return refactor_code(code, language, output)

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/htmlcssjsgenerate-code", methods=["POST"])
@token_required
def htmlcssjs_generate_stream():
    data = request.get_json()
    project_description = data.get("prompt")
    code_type = data.get("type")
    html_content = data.get("htmlContent", "")
    css_content = data.get("cssContent", "")

    if not project_description:
        return jsonify({"error": "Project description is required"}), 400

    if code_type not in ["html", "css", "js"]:
        return jsonify({"error": "Invalid or missing 'type' parameter"}), 400

    try:
        if code_type == "html":
            return generate_html(project_description)
        elif code_type == "css":
            return generate_css(html_content, project_description)
        elif code_type == "js":
            return generate_js(html_content, css_content, project_description)
        else:
            return jsonify({"error": "Unsupported code type."}), 400

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500


@app.route("/htmlcssjsrefactor-code", methods=["POST"])
@token_required
def htmlcssjs_refactor():
    try:
        data = request.get_json()
        html_content = data.get("html") if len(data.get("html", "")) > 0 else ""
        css_content = data.get("css") if len(data.get("css", "")) > 0 else ""
        js_content = data.get("js") if len(data.get("js", "")) > 0 else ""
        code_type = data.get("type")
        problem_description_raw = data.get("problem_description")
        problem_description = (
            problem_description_raw.strip().lower() if problem_description_raw else None
        )

        if not code_type:
            return jsonify({"error": "Type is required."}), 400

        if code_type == "html" and html_content and problem_description:
            html_content_refactored = refactor_code_html_css_js(
                "html",
                refactor_html_prompt_user,
                {"html_content": html_content},
                problem_description,
            )
            html_content_refactored = re.search(
                CODE_REGEX, html_content_refactored, re.DOTALL
            )
            html_content_refactored = (
                html_content_refactored.group(1)
                if html_content_refactored
                else html_content
            )
            return jsonify({"html": html_content_refactored})

        elif code_type == "css" and html_content and problem_description:
            if not html_content:
                return (
                    jsonify({"error": "HTML content is required for CSS refactoring."}),
                    400,
                )
            css_content_refactored = refactor_code_html_css_js(
                "css",
                refactor_css_prompt_user,
                {"html_content": html_content, "css_content": css_content},
                problem_description,
            )
            css_content_refactored = re.search(
                CODE_REGEX, css_content_refactored, re.DOTALL
            )
            css_content_refactored = (
                css_content_refactored.group(1)
                if css_content_refactored
                else css_content
            )
            return jsonify({"css": css_content_refactored})

        elif code_type == "js" and html_content and css_content and problem_description:
            if not html_content or not css_content:
                return (
                    jsonify(
                        {
                            "error": "Both HTML and CSS content are required for JS refactoring."
                        }
                    ),
                    400,
                )
            js_content_refactored = refactor_code_html_css_js(
                "js",
                refactor_js_prompt_user,
                {
                    "html_content": html_content,
                    "css_content": css_content,
                    "js_content": js_content,
                },
                problem_description,
            )
            js_content_refactored = re.search(
                CODE_REGEX, js_content_refactored, re.DOTALL
            )
            js_content_refactored = (
                js_content_refactored.group(1) if js_content_refactored else js_content
            )

            return jsonify({"js": js_content_refactored})

        elif code_type == "html" and html_content:
            html_content_refactored = refactor_code_html_css_js(
                "html", refactor_html_prompt, {"html_content": html_content}
            )
            html_content_refactored = re.search(
                CODE_REGEX, html_content_refactored, re.DOTALL
            )
            html_content_refactored = (
                html_content_refactored.group(1)
                if html_content_refactored
                else html_content
            )
            return jsonify({"html": html_content_refactored})

        elif code_type == "css" and html_content:
            if not html_content:
                return (
                    jsonify({"error": "HTML content is required for CSS refactoring."}),
                    400,
                )
            css_content_refactored = refactor_code_html_css_js(
                "css",
                refactor_css_prompt,
                {"html_content": html_content, "css_content": css_content},
            )
            css_content_refactored = re.search(
                CODE_REGEX, css_content_refactored, re.DOTALL
            )
            css_content_refactored = (
                css_content_refactored.group(1)
                if css_content_refactored
                else css_content
            )
            return jsonify({"css": css_content_refactored})

        elif code_type == "js" and html_content and css_content:
            if not html_content or not css_content:
                return (
                    jsonify(
                        {
                            "error": "Both HTML and CSS content are required for JS refactoring."
                        }
                    ),
                    400,
                )
            js_content_refactored = refactor_code_html_css_js(
                "js",
                refactor_js_prompt,
                {
                    "html_content": html_content,
                    "css_content": css_content,
                    "js_content": js_content,
                },
            )
            js_content_refactored = re.search(
                CODE_REGEX, js_content_refactored, re.DOTALL
            )
            js_content_refactored = (
                js_content_refactored.group(1) if js_content_refactored else js_content
            )
            return jsonify({"js": js_content_refactored})

        else:
            return (
                jsonify(
                    {
                        "error": "Please provide the appropriate content for the requested type."
                    }
                ),
                400,
            )

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=False, port=5001)