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

async function generateStop6Part2Audio() {
  try {
    console.log('Generating audio for Stop 6 (Part 2 - Main Description)...');
    
    // Main description part 2 for Stop 6
    const description = "The Begijnhof dates back to the 14th century and was originally built as a community for the Beguines – pious women who lived in a sisterhood here. These women were not nuns (they didn't take permanent vows), but they lived a semi-religious life devoted to charity and prayer, while still participating in the world. Think of them as an early girl-power community – they were independent, unmarried women in an age when that was uncommon. The Beguines supported themselves (some were nurses, some made lace or taught children) and they could leave to marry if they chose.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop6_part2.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 2 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop6Part2Audio();