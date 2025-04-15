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

async function generateStop1Part3Audio() {
  try {
    console.log('Generating audio for Stop 1 (Part 3 - Kids Content)...');
    
    // Kids content for Stop 1
    const kidsContent = "For Kids: Inside NEMO are five floors of hands-on science exhibits, where kids and adults can experiment and play. You can blow giant bubbles and learn about water, electricity, and light through fun activities! Fun fact: The roof of NEMO is actually a public square where you can see a great view of Amsterdam! Kids, try a fun challenge: can you count how many church towers you see from up here?";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: kidsContent,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop1_part3.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 3 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop1Part3Audio();