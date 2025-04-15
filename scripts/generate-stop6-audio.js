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

// Function to generate transcript with kids content
function generateTranscript(stop) {
  // Combine description with kids content for a complete transcript
  let transcript = stop.description;
  
  if (stop.kidsContent) {
    transcript += `\n\nFor Kids:\n${stop.kidsContent}`;
  }
  
  return transcript;
}

async function generateStop6Audio() {
  try {
    // Begijnhof data
    const stopData = {
      id: 6,
      orderNumber: 6,
      title: "Begijnhof",
      description: "Stepping through the gate into the Begijnhof is like entering a tranquil oasis hidden from the city buzz. Please remember to speak softly here, as this is a private residential courtyard. Take in the scene: neat lawn and gardens, surrounded by a ring of historic houses with gabled roofs, some brick, some with big windows, all beautifully kept. In the center stands a small white chapel. It's hard to believe noisy Kalverstraat is just a minute away – in here, you might only hear birds chirping. The Begijnhof dates back to the 14th century and was originally built as a community for the Beguines – pious women who lived in a sisterhood here. These women were not nuns (they didn't take permanent vows), but they lived a semi-religious life devoted to charity and prayer, while still participating in the world. Think of them as an early girl-power community – they were independent, unmarried women in an age when that was uncommon. The Beguines supported themselves (some were nurses, some made lace or taught children) and they could leave to marry if they chose. The last Beguine lived here until 1971, remarkably! So this courtyard was in continuous use by Beguines for over 600 years. Today, single women (not Beguines) still reside in these houses, preserving the tradition of a women's sanctuary. Look around for the oldest wooden house in Amsterdam. Along one side of the courtyard, you'll notice a black-painted house with white framing (Begijnhof #34). That is the Houten Huys, dating from around 1420. It has a gothic wooden facade and is one of only two wooden houses left in the center of Amsterdam (wooden buildings were largely banned in 1521 due to fire risk).",
      kidsContent: "We're entering a secret garden hidden in the middle of the city! Long ago, a group of special women called Beguines lived here. They weren't nuns, but they were religious and helped take care of sick people. Can you spot the oldest wooden house in Amsterdam? It's over 600 years old and painted black with white trim! Look at how the houses face inward to this peaceful garden, like they're hiding from the busy city. It's incredible that this humble dark house has stood here while the world changed around it – from the days of knights and plagues to the age of smartphones."
    };
    
    // Generate the transcript
    const transcript = generateTranscript(stopData);
    
    console.log('Generating audio for Stop 6: Begijnhof...');
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: transcript,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop6.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating stop audio:', error);
  }
}

// Run the script
generateStop6Audio();