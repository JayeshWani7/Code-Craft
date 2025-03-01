const express = require("express");
const fs = require("fs");
const axios = require("axios");

const app = express();
const PORT = 5001;
const OLLAMA_URL = "http://localhost:11434/api/generate";
const FILE_NAME = "server/sample.java"; // Adjust path if needed

// Function to read Java file
const readJavaFile = () => {
  try {
    return fs.readFileSync(FILE_NAME, "utf8");
  } catch (error) {
    return { error: "Failed to read Java file" };
  }
};

// Function to check solution correctness
const checkSolution = async (javaCode) => {
  const prompt = `
  You are a Java coding assistant. Only return a JSON response.

  Java Code:
  \`\`\`java
  ${javaCode}
  \`\`\`
  `;

  const data = {
    model: "LearnCode",
    prompt: prompt,
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

// API endpoint to test Java solution
app.get("/test-solution", async (req, res) => {
  const javaCode = readJavaFile();

  if (javaCode.error) {
    return res.json(javaCode);
  }

  const result = await checkSolution(javaCode);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
