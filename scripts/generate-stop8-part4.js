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
    
    // Main description part 4 and kids content for Stop 8
    const description = "Standing here, you might even hear those same bells ring, bridging the past to the present. Anne and her family were eventually discovered and deported; Anne died in a concentration camp in 1945, but her father survived and published her diary. The Jordaan area around us is also known for its music – it's the birthplace of many Dutch folk songs. Sometimes on weekends, you might hear someone singing old Dutch tunes in a café. The Noordermarkt hosts organic farmer's markets and flea markets. It's this blend of culture – from Anne's legacy to Rembrandt's resting place to everyday Dutch living – that makes the Jordaan special. And now for the kids: We're in the Jordaan – once a neighborhood where workers and immigrants lived, now full of art, music, and delicious food! See that tall church tower with the blue crown? That's the Westerkerk, and it plays beautiful bell music. Nearby is the Anne Frank House, where a girl about your age had to hide during wartime and wrote a famous diary. The Jordaan has lots of secret gardens called 'hofjes' hidden between buildings. People play special Dutch folk music here called 'levenslied' during street festivals. It's like a treasure hunt to find all the cool spots! Anne wrote about hearing the Westerkerk bells and how they cheered her up: 'Father, Mother and Margot still can't get used to the chiming of the Westertoren clock... Not me, I liked it from the start – it sounds so reassuring, especially at night.'";
    
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