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

async function generateStop6Part3Audio() {
  try {
    console.log('Generating audio for Stop 6 (Part 3 - Main Description)...');
    
    // Main description part 3 for Stop 6
    const description = "The last Beguine lived here until 1971, remarkably! So this courtyard was in continuous use by Beguines for over 600 years. Today, single women (not Beguines) still reside in these houses, preserving the tradition of a women's sanctuary. Look around for the oldest wooden house in Amsterdam. Along one side of the courtyard, you'll notice a black-painted house with white framing (Begijnhof #34). That is the Houten Huys, dating from around 1420. It has a gothic wooden facade and is one of only two wooden houses left in the center of Amsterdam (wooden buildings were largely banned in 1521 due to fire risk).";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop6_part3.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 3 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop6Part3Audio();