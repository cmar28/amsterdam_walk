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

async function generateStop5Part1Audio() {
  try {
    console.log('Generating audio for Stop 5 (Part 1 - Main Description)...');
    
    // Main description part 1 for Stop 5
    const description = "Welcome to Dam Square, the very heart of Amsterdam. This sprawling plaza is often bustling with life – you'll likely see street performers, pigeons fluttering about, locals on bikes cutting across, and tourists snapping photos. Take a 360° look: on one side stands the grand Royal Palace with its classical facade and green-domed tower, and next to it the Gothic windows of the Nieuwe Kerk (New Church). In the middle of the square is a tall white stone pillar – that's the National Monument, honoring the victims of World War II.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop5_part1.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 1 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop5Part1Audio();