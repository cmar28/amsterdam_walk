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

async function generateStop6Part1Audio() {
  try {
    console.log('Generating audio for Stop 6 (Part 1 - Main Description)...');
    
    // Main description part 1 for Stop 6
    const description = "Stepping through the gate into the Begijnhof is like entering a tranquil oasis hidden from the city buzz. Please remember to speak softly here, as this is a private residential courtyard. Take in the scene: neat lawn and gardens, surrounded by a ring of historic houses with gabled roofs, some brick, some with big windows, all beautifully kept. In the center stands a small white chapel. It's hard to believe noisy Kalverstraat is just a minute away – in here, you might only hear birds chirping.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop6_part1.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 1 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop6Part1Audio();