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

async function generateStop7Part3bAudio() {
  try {
    console.log('Generating audio for Stop 7 (Part 3b - Main Description)...');
    
    // Main description part 3b for Stop 7 (second half of original part 3)
    const description = "These tall houses often lean slightly forward and have a hook or beam at the top. Look up and you'll spot hoisting hooks on many gables. They are functional: since staircases inside are very tight and steep, people use those hooks to hoist furniture and goods up through the windows. You might even catch someone moving a couch via the window – it still happens regularly. It's a real-life physics lesson: pulleys at work!";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop7_part3b.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 3b saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop7Part3bAudio();