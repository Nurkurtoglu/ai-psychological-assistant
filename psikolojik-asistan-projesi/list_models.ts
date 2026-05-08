import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
async function main() {
    // There isn't a direct listModels exposed in the basic class sometimes, but wait
    // fetch is available
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log(data.models.filter((m: any) => m.name.includes("embed")).map((m: any) => m.name));
}
main();
