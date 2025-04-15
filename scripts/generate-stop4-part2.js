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

async function generateStop4Part2Audio() {
  try {
    console.log('Generating audio for Stop 4 (Part 2 - Main Description)...');
    
    // Main description part 2 for Stop 4
    const description = "Its architecture is hard to miss: a grand entry with tiled green-and-gold roof, carved dragons, and a bright red façade. This beautiful temple, also known simply as He Hua Temple (荷華寺), was inaugurated in 2000 – even Queen Beatrix of the Netherlands came to open it officially on September 15, 2000. 'He Hua' means 'Lotus Flower' in Chinese, symbolizing purity. It's also a clever nod to the Netherlands (荷兰 Helan is 'Holland' in Chinese, using the same character '荷' for lotus). So the temple's name connects the Dutch and Chinese cultures in one phrase – pretty neat!";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop4_part2.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 2 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop4Part2Audio();