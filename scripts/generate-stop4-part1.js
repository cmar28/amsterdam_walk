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

async function generateStop4Part1Audio() {
  try {
    console.log('Generating audio for Stop 4 (Part 1 - Main Description)...');
    
    // Main description part 1 for Stop 4
    const description = "As we walk along Zeedijk, you might feel like we've traveled to a different country! Welcome to Amsterdam's small but vibrant Chinatown. The street name Zeedijk means 'Sea Dike' – centuries ago, this street was a dike holding back the waters of the IJ bay. Sailors from all over the world came ashore here, and in the 20th century Chinese sailors and merchants settled in this area, creating Chinatown. Right in front of us is the Fo Guang Shan He Hua Temple, the largest Buddhist temple in Europe built in traditional Chinese style.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop4_part1.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 1 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop4Part1Audio();