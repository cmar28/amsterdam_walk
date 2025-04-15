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

async function generateStop2Part4Audio() {
  try {
    console.log('Generating audio for Stop 2 (Part 4 - Kids Content)...');
    
    // Kids content for Stop 2 (shortened to avoid timeout)
    const kidsContent = "Montelbaanstoren has a fun nickname: 'Malle Jaap,' meaning 'Silly Jack' in Dutch. When the new clock and bells were installed, they would often chime at odd hours or not at all, confusing everyone! Ask the kids what they would nickname a tower that rings whenever it wants?";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: kidsContent,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop2_part4.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 4 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop2Part4Audio();