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

async function generateStop7Part4bAudio() {
  try {
    console.log('Generating audio for Stop 7 (Part 4b - Main Description)...');
    
    // Main description part 4b for Stop 7 (second half of original part 4)
    const description = "This area is also great to point out the typical Dutch lifestyle along canals: people actually live in those canal houses and even on the water in houseboats moored along the sides. Houseboats often have plants and chairs on their decks – a floating front yard. The canals are alive – you might see locals kayaking, families on small motorboats cruising by, or ducks paddling in formation.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop7_part4b.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 4b saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop7Part4bAudio();