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

async function generateStop8Part2Audio() {
  try {
    console.log('Generating audio for Stop 8 (Part 2 - Main Description)...');
    
    // Main description part 2 for Stop 8 - shortened to avoid API timeout
    const description = "Towering above us is the Westerkerk (Western Church), with its blue crown-topped spire reaching 85 meters high. This is the tallest church tower in Amsterdam. The blue crown is the symbol of Emperor Maximilian of Austria, who gave Amsterdam the right to use his crown in its coat of arms as thanks for support centuries ago.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop8_part2.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 2 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop8Part2Audio();