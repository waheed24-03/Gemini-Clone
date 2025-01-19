
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = "AIzaSyAylHnQkMcmDmyp4jDe9hpqeBmQP3QpwXE"; // Make sure to add your API key here
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function runChat(prompt) {
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(prompt);

        if (result.harmCategories && result.harmCategories.includes(HarmCategory.SAFETY)) {
            throw new Error("Response was blocked due to safety concerns.");
        }

        const response = result.response;
        console.log(response.text());
        return response.text();
    } catch (error) {
        console.error("Error in runChat:", error);
        if (error.message.includes("safety")) {
            return "The response was blocked due to safety concerns.";
        } else {
            return "An error occurred while fetching the response.";
        }
    }
}

export default runChat;
