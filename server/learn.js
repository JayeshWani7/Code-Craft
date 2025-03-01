const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 5000;
const OLLAMA_URL = "http://localhost:11434/api/generate";

// Function to generate coding questions
const generateQuestions = async () => {
  const finalPrompt = `
  Generate 10 Java coding questions for beginners and intermediate level.

  Format the response strictly in JSON.
  `;

  const data = {
    model: "LearnCode",
    prompt: finalPrompt,
    stream: false,
  };

  try {
    const response = await axios.post(OLLAMA_URL, data, {
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 200) {
      return response.data.response;
    } else {
      return { error: `API error: ${response.statusText}` };
    }
  } catch (error) {
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
