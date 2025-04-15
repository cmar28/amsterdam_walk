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

async function generateStop7Part1Audio() {
  try {
    console.log('Generating audio for Stop 7 (Part 1 - Main Description)...');
    
    // Main description part 1 for Stop 7
    const description = "Now we find ourselves amid Amsterdam's famous Canal Belt, a UNESCO World Heritage site of concentric canals dug in the 17th century. Take a look at the view down the canal – it's postcard-perfect: water reflecting the sky, arched bridges decorated with flower boxes, and rows of narrow, tall canal houses shoulder-to-shoulder. Amsterdam has 165 canals totaling over 100 km, which is why it's often called the 'Venice of the North.' But fun fact: Amsterdam actually has more bridges than Venice (around 1,500 of them!). The canals were not just for beauty – they served as transport highways and helped expand the city in a planned way during the Dutch Golden Age.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop7_part1.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 1 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop7Part1Audio();