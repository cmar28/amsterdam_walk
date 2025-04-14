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
    // Short test transcript
    const testTranscript = "This is a test of the Amsterdam Tour audio guide. Welcome to our walking tour of Amsterdam's cultural highlights!";
    
    console.log('Generating test audio file...');
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "fable", // British accent, good for storytelling
      input: testTranscript,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Save the audio file
    const outputPath = path.join('public/audio', 'test.mp3');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Test audio saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating test audio:', error);
  }
}

// Run the script
generateTestAudio();