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

async function generateStop5Part3Audio() {
  try {
    console.log('Generating audio for Stop 5 (Part 3 - Main Description)...');
    
    // Main description part 3 for Stop 5
    const description = "Look up at the very top of the palace. Can you see the statue of Atlas holding a globe on his shoulders? That's from Greek mythology – Atlas holding up the sky. That statue is actually over three meters tall, but looks small from down here! Also notice the palace's roof has a little tower with a weather vane ship – a nod to Amsterdam's seafaring wealth.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop5_part3.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 3 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop5Part3Audio();