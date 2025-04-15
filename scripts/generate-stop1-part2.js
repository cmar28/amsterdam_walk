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

async function generateStop1Part2Audio() {
  try {
    console.log('Generating audio for Stop 1 (Part 2)...');
    
    // Second part of Stop 1 description
    const part2 = "If you have time after the tour, it's worth a visit – you can blow giant soap bubbles or conduct electricity with a human chain! For now, let's head up to the rooftop terrace. From the top, you get a panoramic view of Amsterdam's old city center. Point out the spires and towers you see: in the distance, you might spot a tall white clock tower – that's our next stop, the Montelbaanstoren. You can also see the busy harbor below, with boats and the replica 18th-century ship at the Maritime Museum nearby. Take a moment to soak in the view and snap a family photo with Amsterdam's skyline.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: part2,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop1_part2.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 2 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop1Part2Audio();