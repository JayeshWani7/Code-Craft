const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // Load API key from .env file

const app = express();
const PORT = 5001;
const GEMINI_API_KEY = "AIzaSyCXS8cqy_sJSRRjAh5rW9Q1sToqigK_5Nw"; // Store API key in .env file

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyCXS8cqy_sJSRRjAh5rW9Q1sToqigK_5Nw");

const generateQuestions = async () => {
  const finalPrompt = `
  You are a Java coding assistant. Check if the given Java code is correct for solving the problem.
- Generate 3-4 test cases.
- Run the code against them.
You don't have to explain anything 
- If all test cases pass, return: {{ "status": "Success", "message": "Solution is correct!" }}
- If any test case fail, return: {{ "status": "Failure", "message": "Try again. Some test cases failed." }}
    

  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Use latest stable version
    const result = await model.generateContent(finalPrompt);
    const response = await result.response.text(); // Extract text response

    // Gemini sometimes wraps JSON in markdown (```json ... ```)
    const cleanedResponse = response.replace(/```json|```/g, "").trim();

    return JSON.parse(cleanedResponse); // Parse JSON correctly
  } catch (error) {
    console.error("Error generating questions:", error);
    return { error: `Request failed: ${error.message}` };
  }
};

// API endpoint to get generated questions
app.get("/test-solutions", async (req, res) => {
  const questions = await generateQuestions();
  res.json(questions);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
