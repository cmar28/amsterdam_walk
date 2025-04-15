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

async function generateStop8Part3aAudio() {
  try {
    console.log('Generating audio for Stop 8 (Part 3a - Main Description)...');
    
    // Main description part 3a for Stop 8 (continued)
    const description = "From the outside, the Anne Frank House looks like any other canal house – tall, narrow, with big windows (blinds likely drawn). Point out the attic window where Anne could see a chestnut tree and the Westerkerk's clock tower. Anne wrote about hearing the Westerkerk bells and how they cheered her up: 'Father, Mother and Margot still can't get used to the chiming of the Westertoren clock... Not me, I liked it from the start – it sounds so reassuring, especially at night.'";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop8_part3a.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 3a saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop8Part3aAudio();