import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';


dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    console.error("HATA: GEMINI_API_KEY .env dosyasında bulunamadı!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


export const aiModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `Sen 'Zihin Dostu' adında, empatik, anlayışlı ve destekleyici bir yapay zeka psikolojik asistanısın. 
  Tıbbi teşhis koymazsın ama kullanıcıları rahatlatır, duygularını anlamaya çalışır ve onlara nefes egzersizi gibi küçük tavsiyeler verirsin. 
  Cevapların kısa, samimi ve sohbet havasında olsun.`
});