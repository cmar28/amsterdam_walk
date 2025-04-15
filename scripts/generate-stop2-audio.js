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

async function generateStop2Audio() {
  try {
    // Montelbaanstoren data
    const stopData = {
      id: 2,
      orderNumber: 2,
      title: "Montelbaanstoren",
      description: "Here we are at Montelbaanstoren, a picturesque 16th-century tower on the canal Oudeschans. This brick tower was originally built around 1512–1516 as part of Amsterdam's medieval city wall. Imagine back then: city guards stood watch here, scanning for enemy ships on the waterways. In fact, the tower's base is one of the last remnants of Amsterdam's old defensive walls. As you look up, notice the upper section is a different color – the elegant cream-colored clock tower was added later, in 1606, to make the tower look more attractive when the walls were no longer used. Montelbaanstoren has a fun nickname: 'Malle Jaap,' meaning 'Silly Jack' in Dutch. Why silly? Well, when the new clock and bells were installed, they had a mind of their own – the bells would often chime at odd hours or not at all, confusing everyone! The townspeople joked that the tower was a bit crazy, and the nickname stuck. You might share a laugh imagining the bell ringing in the middle of the night by accident, causing folks to check their watches. This spot was also a gathering point for sailors in the 1600s. In Amsterdam's Golden Age, sailors would meet at the base of this tower before embarking on long voyages. Picture them in old-timey clothes, hugging their families goodbye next to this very canal. Perhaps a sailor's children back then found comfort seeing the Montelbaanstoren – much like a lighthouse – as their father's ship drifted away to sea. Storytelling tip for kids: Maybe a family of ducks in the canal 'quacked' along when the bells misfired, giving the sailors a funny send-off! Today, Montelbaanstoren stands peacefully by houseboats and bikes, a reminder of Amsterdam's maritime past. Take a look around: houseboats line the canal here, and locals relax on benches when the sun is out. It's a great spot for a short rest. Feel the old brick wall of the tower – it's over 500 years old! You are literally touching history.",
      kidsContent: "Montelbaanstoren has a fun nickname: 'Malle Jaap,' meaning 'Silly Jack' in Dutch. Why silly? Well, when the new clock and bells were installed, they had a mind of their own – the bells would often chime at odd hours or not at all, confusing everyone! You might share a laugh imagining the bell ringing in the middle of the night by accident, causing folks to check their watches. Ask the kids: What would you nickname a tower that rings whenever it wants? Silly Jack seems just right! Kids can count the floors and windows on the tower or wave at any passing canal boat. When you hear the modern chime of the clock (it behaves nowadays, ringing on the hour), you'll know time's up to move on."
    };
    
    // Generate the transcript
    const transcript = generateTranscript(stopData);
    
    console.log('Generating audio for Stop 2: Montelbaanstoren...');
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: transcript,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop2.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating stop audio:', error);
  }
}

// Run the script
generateStop2Audio();