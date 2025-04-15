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

async function generateStop8Part4Audio() {
  try {
    console.log('Generating audio for Stop 8 (Part 4 - Main Description & Kids Content)...');
    
    // Main description part 4 for Stop 8 - shortened to avoid API timeout
    const description = "Standing here, you might even hear those same bells ring, bridging the past to the present. Anne and her family were eventually discovered and deported; Anne died in a concentration camp in 1945, but her father survived and published her diary. The Jordaan area around us is also known for its music – it's the birthplace of many Dutch folk songs. Sometimes on weekends, you might hear someone singing old Dutch tunes in a café.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop8_part4.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 4 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop8Part4Audio();