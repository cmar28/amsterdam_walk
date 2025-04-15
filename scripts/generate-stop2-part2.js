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

async function generateStop2Part2Audio() {
  try {
    console.log('Generating audio for Stop 2 (Part 2)...');
    
    // Second part of Stop 2 description
    const part2 = "Montelbaanstoren has a fun nickname: 'Malle Jaap,' meaning 'Silly Jack' in Dutch. Why silly? Well, when the new clock and bells were installed, they had a mind of their own – the bells would often chime at odd hours or not at all, confusing everyone! The townspeople joked that the tower was a bit crazy, and the nickname stuck. You might share a laugh imagining the bell ringing in the middle of the night by accident, causing folks to check their watches. This spot was also a gathering point for sailors in the 1600s. In Amsterdam's Golden Age, sailors would meet at the base of this tower before embarking on long voyages. Picture them in old-timey clothes, hugging their families goodbye next to this very canal. Perhaps a sailor's children back then found comfort seeing the Montelbaanstoren – much like a lighthouse – as their father's ship drifted away to sea.";
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: part2,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop2_part2.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio for Part 2 saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateStop2Part2Audio();