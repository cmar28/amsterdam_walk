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

async function generateStop5Part4Audio() {
  try {
    console.log('Generating audio for Stop 5 (Part 4 - Kids Content)...');
    
    // Kids content for Stop 5
    const kidsContent = "This big square is where Amsterdam started! It used to be a real dam that stopped the water from flooding the city. Now it's where people hang out and meet. Can you find the big white pillar monument? It's a special place to remember brave people from a long time ago. Look at the fancy building – that's where the king of the Netherlands sometimes works! Fun sight game: Look up at the very top of the palace. Can you see the statue of Atlas holding a globe on his shoulders? That's from Greek mythology – Atlas holding up the sky.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: kidsContent,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop5_part4.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 4 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop5Part4Audio();