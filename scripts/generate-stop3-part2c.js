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

async function generateStop3Part2cAudio() {
  try {
    console.log('Generating audio for Stop 3 (Part 2c)...');
    
    // Third part of Stop 3 description
    const part2c = "In fact, a famous event took place inside: in 1632 the surgeons commissioned the artist Rembrandt to paint an anatomy lesson here – that painting ('The Anatomy Lesson of Dr. Tulp') became world-famous! Today the Waag hosts a café/restaurant called In de Waag – and it's our lunch stop. Fun fact: The Waag is the oldest non-religious building in Amsterdam!";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: part2c,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop3_part2c.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 2c saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop3Part2cAudio();