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

async function generateStop4Audio() {
  try {
    // Zeedijk and Fo Guang Shan He Hua Temple data
    const stopData = {
      id: 4,
      orderNumber: 4,
      title: "Zeedijk and Fo Guang Shan He Hua Temple",
      description: "As we walk along Zeedijk, you might feel like we've traveled to a different country! Welcome to Amsterdam's small but vibrant Chinatown. The street name Zeedijk means 'Sea Dike' – centuries ago, this street was a dike holding back the waters of the IJ bay. Sailors from all over the world came ashore here, and in the 20th century Chinese sailors and merchants settled in this area, creating Chinatown. Right in front of us is the Fo Guang Shan He Hua Temple, the largest Buddhist temple in Europe built in traditional Chinese style. Its architecture is hard to miss: a grand entry with tiled green-and-gold roof, carved dragons, and a bright red façade. This beautiful temple, also known simply as He Hua Temple (荷華寺), was inaugurated in 2000 – even Queen Beatrix of the Netherlands came to open it officially on September 15, 2000. 'He Hua' means 'Lotus Flower' in Chinese, symbolizing purity. It's also a clever nod to the Netherlands (荷兰 Helan is 'Holland' in Chinese, using the same character '荷' for lotus). So the temple's name connects the Dutch and Chinese cultures in one phrase – pretty neat! Take a moment to admire the intricate details on the temple's exterior. The large red doors might be open during the day – if so, you are welcome to step inside quietly (just be respectful: turn off flashes, and note that photography may be restricted).",
      kidsContent: "Look at the special temple with its colorful roof and dragons! This is a Buddhist temple where people come to pray and be peaceful. There are two stone lions at the entrance to protect the temple. Can you find any animals or mythical creatures carved on the roof? Dragons and phoenixes are common in Chinese temples – see if you can spot them! If the kids need a sweet snack, you can pop into a Chinese bakery on Zeedijk for an egg tart or bubble tea. They might get a kick out of seeing Chinese zodiac animals on decorations or colorful posters for the next Lunar New Year festival."
    };
    
    // Generate the transcript
    const transcript = generateTranscript(stopData);
    
    console.log('Generating audio for Stop 4: Zeedijk and Fo Guang Shan He Hua Temple...');
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: transcript,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop4.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating stop audio:', error);
  }
}

// Run the script
generateStop4Audio();