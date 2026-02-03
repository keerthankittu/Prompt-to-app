// Import necessary packages
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // To load environment variables from .env file


// --- Configuration ---
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("FATAL ERROR: GEMINI_API_KEY environment variable is not set.");
  process.exit(1);
}

// --- Initialize Express App and Gemini AI ---
const app = express();
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });



// --- Middleware ---
// To parse JSON bodies from POST requests
app.use(express.json());

// ✅ Serve index.html directly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// --- API Endpoint for Code Generation ---
app.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // This is the "System Prompt" or "Meta-Prompt".
    // It instructs the AI on its role, the required format, and constraints.
    const fullPrompt = `
      You are an expert web developer specializing in creating single-file, runnable web applications.
      Your task is to generate a complete HTML file based on the user's request.

      **CRITICAL INSTRUCTIONS:**
      1.  **Single File Output:** All HTML, CSS, and JavaScript MUST be contained within a single .html file.
      2.  **Styling:** Use Tailwind CSS for all styling. Include the Tailwind CDN script tag in the <head>: <script src="https://cdn.tailwindcss.com"></script>. DO NOT use <style> tags unless absolutely necessary for something Tailwind cannot do (like complex keyframe animations).
      3.  **JavaScript:** All JavaScript logic MUST be placed within a single <script> tag at the end of the <body>.
      4.  **No Placeholders:** The generated code should be fully functional. Do not include comments like "// your code here" or placeholders.
      5.  **Aesthetics:** Ensure the design is modern, visually appealing, and responsive. Use good color palettes, spacing, and typography.
      6.  **Raw HTML Only:** Your entire response must be ONLY the raw HTML code for the file. Do not include any explanatory text, markdown formatting (like \`\`\`html), or any other characters before the \`<!DOCTYPE html>\` tag or after the \`</html>\` tag.

      **User's Request:** "${prompt}"
    `;
    
    // Generate content with Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const code = response.text();

    // Send the generated code back to the frontend
    res.json({ code: code });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'An error occurred while generating the code.' });
  }
});
// --- Start the server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
