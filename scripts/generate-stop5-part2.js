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

async function generateStop5Part2Audio() {
  try {
    console.log('Generating audio for Stop 5 (Part 2 - Main Description)...');
    
    // Main description part 2 for Stop 5
    const description = "It's called Dam Square because this is literally where Amsterdam began – as a dam on the Amstel River in the 13th century. The city's name, Amsteldam, comes from 'dam on the Amstel.' Standing here, you're on what was once a simple dam holding back river water. The Royal Palace was built in the 17th century, not originally as a palace but as Amsterdam's City Hall during the Dutch Golden Age. At that time, it was touted as the largest administrative building in Europe, even called the 'Eighth Wonder of the World.' In the 19th century, it became a royal palace.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop5_part2.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 2 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop5Part2Audio();