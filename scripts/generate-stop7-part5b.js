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

async function generateStop7Part5bAudio() {
  try {
    console.log('Generating audio for Stop 7 (Part 5b - Kids Content)...');
    
    // Kids content part 5b for Stop 7 (second half of original part 5)
    const description = "One fun activity: count the bicycles parked on the bridge. Amsterdam has more bikes than people – about 800,000 bikes! You'll see them chained everywhere, like an explosion of two-wheelers. And unfortunately, a lot end up in the canals – roughly 12,000–15,000 bikes are fished out of the canals each year. Imagine scuba divers picking up rusted bicycles from the canal floor – what a job! Maybe pop into a sweet shop for a quick treat – Dutch drop (licorice) is famous (though be warned, the salty kind is an acquired taste!), or get a fresh warm stroopwafel made in front of you – the chewy caramel syrup between waffle layers is delightful.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop7_part5b.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 5b saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop7Part5bAudio();