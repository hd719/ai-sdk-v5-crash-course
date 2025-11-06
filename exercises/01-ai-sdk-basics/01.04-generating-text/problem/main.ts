import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

const model = google('gemini-2.0-flash-lite');

const prompt = 'What is the capital of France?';

const result = await generateText({ model, prompt });

console.log(result.text);
