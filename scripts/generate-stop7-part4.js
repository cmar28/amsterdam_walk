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

async function generateStop7Part4Audio() {
  try {
    console.log('Generating audio for Stop 7 (Part 4 - Main Description)...');
    
    // Main description part 4 for Stop 7
    const description = "Walking through the Nine Streets, enjoy the canal vistas at each crossing. We'll likely cross three main canals: Herengracht (Gentlemen's Canal), Keizersgracht (Emperor's Canal), and Prinsengracht (Prince's Canal). Each intersection offers a classic view – be sure to take a family photo on a bridge with canal and bikes in the background. Maybe even do a funny pose imitating the crooked houses (some old houses tilt due to settling ground). This area is also great to point out the typical Dutch lifestyle along canals: people actually live in those canal houses and even on the water in houseboats moored along the sides. Houseboats often have plants and chairs on their decks – a floating front yard. The canals are alive – you might see locals kayaking, families on small motorboats cruising by, or ducks paddling in formation.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop7_part4.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 4 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop7Part4Audio();