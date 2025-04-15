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

async function generateStop2Part3Audio() {
  try {
    console.log('Generating audio for Stop 2 (Part 3)...');
    
    // Third part of Stop 2 description
    const part3 = "Today, Montelbaanstoren stands peacefully by houseboats and bikes, a reminder of Amsterdam's maritime past. Take a look around: houseboats line the canal here, and locals relax on benches when the sun is out. It's a great spot for a short rest. Feel the old brick wall of the tower – it's over 500 years old! You are literally touching history.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: part3,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop2_part3.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 3 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop2Part3Audio();