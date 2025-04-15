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

async function generateStop2ShortAudio() {
  try {
    console.log('Generating short audio for Stop 2...');
    
    // Short intro text for Stop 2
    const text = "Here we are at Montelbaanstoren, a picturesque 16th-century tower. This brick tower was built around 1512 as part of Amsterdam's medieval city wall, where guards kept watch for enemies approaching by water.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: text,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop2_short.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Short audio saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating short audio:', error);
  }
}

// Run the script
generateStop2ShortAudio();