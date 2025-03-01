from flask import Flask, jsonify
import json
import requests

app = Flask(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"



# Function to generate coding questions using CodeLlama
def generate_questions():
    final_prompt = """Generate a set of 10 coding questions which consist of Java Beginner and Intermediate level coding questions based on:
    - Output
    - Variables
    - Data types
    - Typecasting
    - Operators
    - Strings
    - Booleans
    - If-else
    - Switch

    Each question should include:
    - **Question**
    - **Solution**
    - **Hint/Steps to solve**.

    Do not repeat any topic or question.
    
    Format the response strictly in JSON format.
    """

    data = {
        "model": "LearnCode",  # Your specific CodeLlama model name
        "prompt": final_prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, json=data, headers={"Content-Type": "application/json"})

        if response.status_code == 200:
            response_json = response.json()  # Directly parse JSON
            actual_response = response_json.get("response", "")

            try:
                questions_list = json.loads(actual_response)  # Ensure it's valid JSON
                return jsonify(questions_list)
            except json.JSONDecodeError:
                return jsonify({"error": "Failed to parse JSON response"})

        else:
            return jsonify({"error": f"API error: {response.text}"})

    except requests.RequestException as e:
        return jsonify({"error": f"Request failed: {str(e)}"})

# API endpoint to get generated questions
@app.route("/generate-questions", methods=["GET"])
def get_questions():
    return generate_questions()

if __name__ == "__main__":
    app.run(debug=True)
