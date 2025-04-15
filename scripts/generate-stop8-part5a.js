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

async function generateStop8Part5aAudio() {
  try {
    console.log('Generating audio for Stop 8 (Part 5a - Kids Content)...');
    
    // Kids content for Stop 8 (continued)
    const description = "The Jordaan has lots of secret gardens called 'hofjes' hidden between buildings. People play special Dutch folk music here called 'levenslied' during street festivals. It's like a treasure hunt to find all the cool spots! Anne wrote about hearing the Westerkerk bells and how they cheered her up: 'Father, Mother and Margot still can't get used to the chiming of the Westertoren clock... Not me, I liked it from the start – it sounds so reassuring, especially at night.'";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop8_part5a.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 5a saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop8Part5aAudio();