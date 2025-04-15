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

async function generateStop7Part5aAudio() {
  try {
    console.log('Generating audio for Stop 7 (Part 5a - Kids Content)...');
    
    // Kids content part 5a for Stop 7 (first half of original part 5)
    const description = "Look at all these pretty canals and fancy houses! These canals were dug over 400 years ago to help ships bring goods into the city. The houses are tall and skinny because people had to pay taxes based on how wide their house was along the canal. The skinnier the house, the less tax they paid! These nine small streets are named after crafts that people used to do here long ago, like making gloves or barrels. Now they're full of cool shops where you can find things you won't see anywhere else!";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop7_part5a.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 5a saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop7Part5aAudio();