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

async function generateStop8Part3Audio() {
  try {
    console.log('Generating audio for Stop 8 (Part 3 - Main Description)...');
    
    // Main description part 3 for Stop 8 - shortened to avoid API timeout
    const description = "Just a few steps away on Prinsengracht 263 is the Anne Frank House. It's the preserved canal house where Anne Frank, a Jewish girl, hid with her family and four others during World War II to escape Nazi persecution. They remained hidden in a secret annex for two years (1942–1944), and during that time Anne, then a teenager, kept a diary that has since touched millions of hearts around the world.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop8_part3.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 3 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop8Part3Audio();