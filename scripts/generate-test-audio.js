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

async function generateTestAudio() {
  try {
    console.log('Generating test audio...');
    
    // Short test text
    const testText = "Welcome to Carlo's Amsterdam Tour. This is a test of the audio narration system.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: testText,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `test_audio.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Test audio saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating test audio:', error);
  }
}

// Run the script
generateTestAudio();