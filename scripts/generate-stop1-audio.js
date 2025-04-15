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

async function generateStop1Audio() {
  try {
    // NEMO Science Museum data
    const stopData = {
      id: 1,
      orderNumber: 1,
      title: "NEMO Science Museum",
      description: "We begin at NEMO Science Museum, the large green building shaped like a ship's hull rising from the water. This striking structure was designed by famed architect Renzo Piano and opened in 1997. Renzo Piano wanted NEMO to evoke Amsterdam's seafaring history – indeed, it looks like a giant ship emerging from the harbor! Standing here, you might imagine you're on the bow of a boat about to sail. NEMO is actually built atop a tunnel that runs under the water, and its roof doubles as a public square with cascading steps. Inside NEMO are five floors of hands-on science exhibits (the largest science center in the Netherlands), where kids and adults can experiment and play. If you have time after the tour, it's worth a visit – you can blow giant soap bubbles or conduct electricity with a human chain! For now, let's head up to the rooftop terrace. From the top, you get a panoramic view of Amsterdam's old city center. Point out the spires and towers you see: in the distance, you might spot a tall white clock tower – that's our next stop, the Montelbaanstoren. You can also see the busy harbor below, with boats and the replica 18th-century ship at the Maritime Museum nearby. Take a moment to soak in the view and snap a family photo with Amsterdam's skyline.",
      kidsContent: "Inside NEMO are five floors of hands-on science exhibits, where kids and adults can experiment and play. You can blow giant bubbles and learn about water, electricity, and light through fun activities! Fun fact: The roof of NEMO is actually a public square where you can see a great view of Amsterdam! Kids, try a fun challenge: can you count how many church towers you see from up here?"
    };
    
    // Generate the transcript
    const transcript = generateTranscript(stopData);
    
    console.log('Generating audio for Stop 1: NEMO Science Museum...');
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: transcript,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop1.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating stop audio:', error);
  }
}

// Run the script
generateStop1Audio();