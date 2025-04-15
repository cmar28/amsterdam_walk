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

async function generateStop7Part2Audio() {
  try {
    console.log('Generating audio for Stop 7 (Part 2 - Main Description)...');
    
    // Main description part 2 for Stop 7
    const description = "We are in the Nine Streets (De 9 Straatjes), a charming grid of (you guessed it) nine little streets connecting the main canals. These streets have quirky names like Hartenstraat (Heart Street) and Berenstraat (Bear Street). Historically, many were named after the leather tanners and other trades that operated here (for example, Huidenstraat means 'Leather Street'). Today, the Nine Streets are filled with cozy cafés, vintage boutiques, art galleries, and design shops. It's a shopper's paradise and a lovely area to wander. The kids might not be into boutique shopping, but there are toy stores and an old-fashioned candy shop somewhere around here if you look – and plenty of spots for a treat. Keep an eye out for a cheese shop with free samples – those are always a hit!";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop7_part2.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 2 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop7Part2Audio();