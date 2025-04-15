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

async function generateStop8Part1Audio() {
  try {
    console.log('Generating audio for Stop 8 (Part 1 - Main Description)...');
    
    // Main description part 1 for Stop 8
    const description = "We conclude our tour in the Jordaan, one of Amsterdam's most beloved neighborhoods. The Jordaan has a cozy, village-like atmosphere with narrow streets, art studios, and cafés with tables on the sidewalk. It was built in the 17th century as a working-class district for artisans and immigrants. Nowadays it's very trendy, but you can still feel the authentic charm – people chatting from their doorsteps, flower boxes in windows, and maybe someone strumming a guitar on a doorstep. Street names here are often flowers and trees (you might see Elandsgracht, Bloemgracht – bloom = flower). Some say the name Jordaan comes from the French word 'Jardin' (garden), reflecting these floral street names or the gardens that once were here.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop8_part1.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 1 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop8Part1Audio();