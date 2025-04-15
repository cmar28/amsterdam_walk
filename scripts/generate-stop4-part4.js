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

async function generateStop4Part4Audio() {
  try {
    console.log('Generating audio for Stop 4 (Part 4 - Kids Content)...');
    
    // Kids content for Stop 4
    const kidsContent = "Look at the special temple with its colorful roof and dragons! This is a Buddhist temple where people come to pray and be peaceful. There are two stone lions at the entrance to protect the temple. Can you find any animals or mythical creatures carved on the roof? Dragons and phoenixes are common in Chinese temples – see if you can spot them! If the kids need a sweet snack, you can pop into a Chinese bakery on Zeedijk for an egg tart or bubble tea. They might get a kick out of seeing Chinese zodiac animals on decorations or colorful posters for the next Lunar New Year festival.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: kidsContent,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop4_part4.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 4 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop4Part4Audio();