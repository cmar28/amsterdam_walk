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

async function generateStop7Part3aAudio() {
  try {
    console.log('Generating audio for Stop 7 (Part 3a - Main Description)...');
    
    // Main description part 3a for Stop 7 (first half of original part 3)
    const description = "As we stroll, notice the architecture of the canal houses. Most are narrow and tall, often 3-4 stories, with ornately shaped gables (the top part of the facade). Why so narrow? Because historically, houses were taxed on their width along the canal, so people built slender homes to save money. (Kids, imagine if your house's tax was based on how wide your front door is – you'd build a skinny house too!) Some houses here are extremely narrow – the narrowest house in Amsterdam is about as wide as a door!";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop7_part3a.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 3a saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop7Part3aAudio();