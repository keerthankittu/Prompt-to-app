import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function testGemini() {
  // Load your Gemini API key from the .env file
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing GEMINI_API_KEY in .env file");
    return;
  }

  // Initialize the Gemini SDK
  const genAI = new GoogleGenerativeAI(apiKey);

  // Use the latest supported Gemini model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  try {
    console.log("⚙️  Sending test request to Gemini...");
    const result = await model.generateContent("Say hello from Gemini!");
    console.log("\n✅ Gemini API Response:\n");
    console.log(result.response.text());
  } catch (error) {
    console.error("\n❌ Error calling Gemini API:");
    console.error(error);
  }
}

testGemini();
