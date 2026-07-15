import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not defined in your environment variables.");
  console.log("Please run: export GEMINI_API_KEY=your_actual_key");
  process.exit(1);
}

const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: apiKey,
});

async function runTest() {
  console.log("Connecting to Gemini API...");
  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-flash-latest",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Write a short 1-sentence welcome message saying Gemini is ready." },
      ],
      temperature: 0.6,
      max_tokens: 100,
    });

    console.log("\nSuccess! Gemini Response:");
    console.log(`"${completion.choices[0].message.content?.trim()}"`);
    console.log(`\nTokens used: ${completion.usage?.total_tokens}`);
  } catch (error: any) {
    console.error("\n Connection Failed!");
    console.error(error.message || error);
  }
}

runTest();
