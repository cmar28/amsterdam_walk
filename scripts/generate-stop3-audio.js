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

async function generateStop3Audio() {
  try {
    // Nieuwmarkt & Lunch at In de Waag data
    const stopData = {
      id: 3,
      orderNumber: 3,
      title: "Nieuwmarkt & Lunch at In de Waag",
      description: "Welcome to Nieuwmarkt, a lively square that has been a center of commerce for centuries. In Dutch, Nieuwmarkt means 'New Market,' and indeed markets have been held here since the 17th century when this area became a public square. The star of Nieuwmarkt is the Waag, the dramatic medieval building in the center that looks like a little castle with pointed towers. Believe it or not, this is one of Amsterdam's oldest buildings – built in 1488 as a city gate known as St. Anthony's Gate. Back then, Amsterdam's city wall ran right here, and this gate allowed entry into the city (imagine huge wooden doors and a drawbridge over a moat!). When the city expanded, the walls came down, and by 1614 the moat around the gate was filled to create this market square. The old gate was repurposed as a weigh house, or 'Waag,' where merchants would weigh and trade goods like grain and butter. If you look up at the building, you can still spot stone plaques and symbols of the guilds that used it: one tower was used by the blacksmiths' guild, another by the masons, and even the surgeons' guild had their meeting room here. In fact, a famous event took place inside: in 1632 the surgeons commissioned the artist Rembrandt to paint an anatomy lesson here – that painting ('The Anatomy Lesson of Dr. Tulp') became world-famous! Today the Waag hosts a café/restaurant called In de Waag – and it's our lunch stop. Fun fact: The Waag is the oldest non-religious building in Amsterdam!",
      kidsContent: "This old building used to be a city gate where people entered Amsterdam. Later it became a place where they weighed goods like cheese and butter to make sure no one was cheating! Different groups of workers like blacksmiths and masons each had their own special room in the building. Ask your kids what they'd trade if this were a market in the old days – tulip bulbs? Spices? Or maybe their allowance for a stroopwafel?"
    };
    
    // Generate the transcript
    const transcript = generateTranscript(stopData);
    
    console.log('Generating audio for Stop 3: Nieuwmarkt & Lunch at In de Waag...');
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: transcript,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop3.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating stop audio:', error);
  }
}

// Run the script
generateStop3Audio();