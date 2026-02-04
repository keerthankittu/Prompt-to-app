import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(express.json());

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// ✅ Explicit root route (THIS IS THE KEY FIX)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Generate app using Gemini
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Generate ONLY clean HTML, CSS (inside <style>) and JS (inside <script>) code.
No explanations. Only code.

User request:
${prompt}
                  `
                }
              ]
            }
          ]
        })
      }
    );

    const data = await geminiResponse.json();
    let generatedCode =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    generatedCode = generatedCode
      .replace(/```html/g, "")
      .replace(/```/g, "");

    res.json({ code: generatedCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

// Download generated HTML
app.post("/download", (req, res) => {
  const { code } = req.body;

  res.setHeader("Content-Disposition", "attachment; filename=app.html");
  res.setHeader("Content-Type", "text/html");
  res.send(code);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
