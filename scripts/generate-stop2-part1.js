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

async function generateStop2Part1Audio() {
  try {
    console.log('Generating audio for Stop 2 (Part 1)...');
    
    // First part of Stop 2 description
    const part1 = "Here we are at Montelbaanstoren, a picturesque 16th-century tower on the canal Oudeschans. This brick tower was originally built around 1512–1516 as part of Amsterdam's medieval city wall. Imagine back then: city guards stood watch here, scanning for enemy ships on the waterways. In fact, the tower's base is one of the last remnants of Amsterdam's old defensive walls. As you look up, notice the upper section is a different color – the elegant cream-colored clock tower was added later, in 1606, to make the tower look more attractive when the walls were no longer used.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: part1,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop2_part1.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 1 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop2Part1Audio();