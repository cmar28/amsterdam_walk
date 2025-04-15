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

async function generateStop6Part4Audio() {
  try {
    console.log('Generating audio for Stop 6 (Part 4 - Kids Content)...');
    
    // Kids content for Stop 6
    const description = "We're entering a secret garden hidden in the middle of the city! Long ago, a group of special women called Beguines lived here. They weren't nuns, but they were religious and helped take care of sick people. Can you spot the oldest wooden house in Amsterdam? It's over 600 years old and painted black with white trim! Look at how the houses face inward to this peaceful garden, like they're hiding from the busy city. It's incredible that this humble dark house has stood here while the world changed around it – from the days of knights and plagues to the age of smartphones.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop6_part4.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 4 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop6Part4Audio();