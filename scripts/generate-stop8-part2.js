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

async function generateStop8Part2Audio() {
  try {
    console.log('Generating audio for Stop 8 (Part 2 - Main Description)...');
    
    // Main description part 2 for Stop 8
    const description = "Towering above us is the Westerkerk (Western Church), with its blue crown-topped spire reaching 85 meters high. This is the tallest church tower in Amsterdam. The blue crown is the symbol of Emperor Maximilian of Austria, who gave Amsterdam the right to use his crown in its coat of arms as thanks for support centuries ago. The Westerkerk was completed in 1631 and Rembrandt van Rijn – the famous painter we talked about – is buried somewhere inside (in an unmarked poor man's grave, as he died in poverty). The church is still in use and if you're lucky to be here on the hour, you'll hear its beautiful carillon bells play.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: description,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop8_part2.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 2 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop8Part2Audio();