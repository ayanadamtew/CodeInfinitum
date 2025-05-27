// services/aiService.js
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from 'dotenv'; // Make sure to import dotenv if you haven't already in your main server file

dotenv.config(); // Load environment variables

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("CRITICAL: GEMINI_API_KEY is not set in .env file. AI Help will not function.");
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" }) : null; // Or "gemini-1.0-pro"

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const generationConfig = {
  temperature: 0.6, // Slightly lower for more focused coding help
  topK: 1,
  topP: 1,
  maxOutputTokens: 600, // Increased slightly for potentially longer explanations
};

export async function getAIHelp(problem, userQuery, conversationHistory = [], currentCode = "") {
  if (!model) {
    console.error("Gemini model not initialized. This usually means GEMINI_API_KEY is missing or invalid.");
    // Do not throw an error here, return a user-friendly message
    return "I'm sorry, the AI assistant is currently unavailable due to a configuration issue.";
  }

  try {
    const systemInstructionText = `You are LeetCoder AI, a specialized programming assistant for a platform similar to LeetCode.
Your primary role is to help users understand and solve coding problems.
- When a user asks for a hint, provide a conceptual nudge or suggest an approach without giving away the direct solution or code.
- If a user provides code and asks for debugging help, analyze their code and point out potential logical errors, syntax issues, or suggest improvements. Explain *why* something might be an issue.
- If a user asks for an explanation of a concept related to the problem, explain it clearly and concisely.
- If a user asks for the solution, politely decline and reiterate your role is to guide them, not solve it for them.
- Keep your responses focused on the problem at hand.
- Format code snippets using markdown (e.g., \`\`\`python ... \`\`\`).
- Be encouraging and supportive.

Problem Context:
Title: ${problem.title}
Statement: ${problem.statement}
${problem.constraints ? `Constraints: ${problem.constraints.join(', ')}` : ''}
${problem.examples && problem.examples.length > 0 ? `Example 1 Input: ${problem.examples[0].input}\nExample 1 Output: ${problem.examples[0].output}` : ''}
`;

    // Gemini expects history in a specific format: { role: "user" / "model", parts: [{ text: "..." }] }
    // The first message in history can be the system instruction.
    const geminiHistory = [
      { role: "user", parts: [{ text: systemInstructionText }] }, // System context as the first "user" turn
      { role: "model", parts: [{ text: "Understood. I'm ready to help with this problem. How can I assist you?" }] } // AI acknowledges
    ];

    // Add existing conversation history
    conversationHistory.forEach(msg => {
      geminiHistory.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });

    // Current user interaction forms the latest message to send
    const currentUserMessageContent = `Current user code (if any):\n\`\`\`\n${currentCode || 'No code provided by user.'}\n\`\`\`\n\nUser's question: ${userQuery}`;


    // For the SDK's chat model, you start a chat with history and then send messages.
    // The `systemInstruction` is best passed during model initialization or as the first turn for context.
    const chat = model.startChat({
      history: geminiHistory, // History now includes the initial system context + user/model turns
      generationConfig,
      safetySettings,
    });

    const result = await chat.sendMessage(currentUserMessageContent); // Send only the new user query
    const response = result.response;

    if (!response || !response.candidates || response.candidates.length === 0) {
     console.warn("Gemini AI: No candidates in response", response);
     return "I'm sorry, I couldn't generate a response at this time.";
    }

    if (response.candidates[0].finishReason === "SAFETY") {
        console.warn("Gemini response blocked due to safety settings.");
        return "I'm sorry, your request was blocked due to safety settings. Please rephrase your query or check the content.";
    }
    if (response.candidates[0].finishReason === "RECITATION") {
         console.warn("Gemini response blocked due to recitation.");
         return "I'm sorry, my response was blocked as it may have contained information from the training data. Please try rephrasing.";
    }
    if (response.candidates[0].finishReason !== "STOP" && response.candidates[0].finishReason !== "MAX_TOKENS") {
        console.warn(`Gemini response stopped due to: ${response.candidates[0].finishReason}`);
        return "I'm sorry, I couldn't complete my response. Please try again.";
    }


    const aiText = response.text(); // SDK provides a convenience method to get text
    return aiText;

  } catch (error) {
    console.error('Gemini AI service error:', error);
    // Provide a more specific error if possible, otherwise generic
    if (error.message && error.message.includes("API key not valid")) {
      return "AI assistant configuration error: Invalid API Key. Please contact support.";
    }
    return "I'm sorry, I encountered an internal error while processing your request. Please try again later.";
  }
}