import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';

// Make sure the audio directory exists
if (!fs.existsSync('public/audio')) {
  fs.mkdirSync('public/audio', { recursive: true });
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateStop3ShortAudio() {
  try {
    console.log('Generating short audio for Stop 3...');
    
    // Short intro text for Stop 3
    const text = "Welcome to Nieuwmarkt, a lively square with the dramatic medieval Waag building at its center. The Waag dates back to 1488 and was originally a city gate before becoming a weighing house for merchants.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: text,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop3_short.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Short audio saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating short audio:', error);
  }
}

// Run the script
generateStop3ShortAudio();