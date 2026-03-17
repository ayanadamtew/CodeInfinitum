import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test(modelName) {
  try {
    const models = await genAI.getGenerativeModel({ model: modelName }).generateContent("Test");
    console.log(modelName, 'SUCCESS:', models.response.text());
  } catch(e) { console.error(modelName, 'ERROR:', e.message); }
}

async function run() {
  await test("gemini-flash-latest");
  await test("gemini-2.5-flash");
}

run();
