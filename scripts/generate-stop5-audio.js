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

async function generateStop5Audio() {
  try {
    // Dam Square data
    const stopData = {
      id: 5,
      orderNumber: 5,
      title: "Dam Square",
      description: "Welcome to Dam Square, the very heart of Amsterdam. This sprawling plaza is often bustling with life – you'll likely see street performers, pigeons fluttering about, locals on bikes cutting across, and tourists snapping photos. Take a 360° look: on one side stands the grand Royal Palace with its classical facade and green-domed tower, and next to it the Gothic windows of the Nieuwe Kerk (New Church). In the middle of the square is a tall white stone pillar – that's the National Monument, honoring the victims of World War II. It's called Dam Square because this is literally where Amsterdam began – as a dam on the Amstel River in the 13th century. The city's name, Amsteldam, comes from 'dam on the Amstel.' Standing here, you're on what was once a simple dam holding back river water. The Royal Palace was built in the 17th century, not originally as a palace but as Amsterdam's City Hall during the Dutch Golden Age. At that time, it was touted as the largest administrative building in Europe, even called the 'Eighth Wonder of the World.' In the 19th century, it became a royal palace. Look up at the very top of the palace. Can you see the statue of Atlas holding a globe on his shoulders? That's from Greek mythology – Atlas holding up the sky. That statue is actually over three meters tall, but looks small from down here! Also notice the palace's roof has a little tower with a weather vane ship – a nod to Amsterdam's seafaring wealth.",
      kidsContent: "This big square is where Amsterdam started! It used to be a real dam that stopped the water from flooding the city. Now it's where people hang out and meet. Can you find the big white pillar monument? It's a special place to remember brave people from a long time ago. Look at the fancy building – that's where the king of the Netherlands sometimes works! Fun sight game: Look up at the very top of the palace. Can you see the statue of Atlas holding a globe on his shoulders? That's from Greek mythology – Atlas holding up the sky."
    };
    
    // Generate the transcript
    const transcript = generateTranscript(stopData);
    
    console.log('Generating audio for Stop 5: Dam Square...');
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: transcript,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop5.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating stop audio:', error);
  }
}

// Run the script
generateStop5Audio();