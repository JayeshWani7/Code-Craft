from flask import Flask, jsonify
import json
import requests
import re  # Import regex module

app = Flask(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
FILE_NAME = "sample.java"  # Java file name

# Function to read Java file
def read_java_file():
    try:
        with open(FILE_NAME, "r") as file:
            return file.read()
    except Exception as e:
        return str(e)

# Function to check solution correctness
def check_solution(java_code):
    prompt = f"""
    You are a Java coding assistant. Only return a JSON response on failure or on success
    
    -"status": "Success",
    -"message": "Solution is correct!"
    
    -"status": "Failure",
    -"message": "Try again. Some test cases failed."
    
    No explanations.
    
    Question: Write a program to print the first letter of each word in a given sentence.
    
    - Generate 3-4 test cases.
    - Run the code against them.
    - If all pass, return: {{ "status": "Success", "message": "Solution is correct!" }}
    - If any fail, return: {{ "status": "Failure", "message": "Try again. Some test cases failed." }}

    Only return JSON. No additional text.

    Java Code:
    ```java
    {java_code}
    ```
    """

    data = {
        "model": "LearnCode",  # Your CodeLlama model
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, json=data, headers={"Content-Type": "application/json"})

        if response.status_code == 200:
            response_json = response.json()
            actual_response = response_json.get("response", "")

            # 🔹 Extract only JSON content using regex (Handles extra text properly)
            json_match = re.findall(r'\{.*?\}', actual_response, re.DOTALL)

            if json_match:
                clean_json = json_match[-1]  # Take the last JSON block (most likely the correct one)
                return json.loads(clean_json)  # Parse JSON response

            return {
                "error": "Failed to extract valid JSON from model response",
                "raw_response": actual_response
            }

        else:
            return {"error": f"API error: {response.text}"}

    except requests.RequestException as e:
        return {"error": f"Request failed: {str(e)}"}

# API endpoint to test Java solution
@app.route("/test-solution", methods=["GET"])
def test_solution():
    java_code = read_java_file()

    if "error" in java_code:
        return jsonify({"error": "Failed to read Java file"})

    result = check_solution(java_code)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
