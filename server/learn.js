const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config(); // Load API key from .env file

const app = express();
const PORT = 5002;
const GEMINI_API_KEY = "AIzaSyCXS8cqy_sJSRRjAh5rW9Q1sToqigK_5Nw"; // Store API key in .env file

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyCXS8cqy_sJSRRjAh5rW9Q1sToqigK_5Nw");

const generateQuestions = async () => {
  const finalPrompt = `
  You are a Java coding problem generator. Your task is to create 10 Java-based coding questions of varying difficulty from beginner, intermediate. Follow these guidelines:
- Generate a mix of problems: 5 beginner, 5 intermediate.
- Ensure questions cover different concepts such as output, variables, datatypes, typecasting, strings, booleans, if-else, switch, loops.

Generate questions, solution and hints.

- Return all 10 questions, solutions and hints in a JSON format.
{
    Question:""
    Solution:""
    Hint:""
}
    

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
app.get("/generate-questions", async (req, res) => {
  const questions = await generateQuestions();
  res.json(questions);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
