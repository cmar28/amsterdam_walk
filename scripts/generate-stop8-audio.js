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

async function generateStop8Audio() {
  try {
    // Jordaan District data
    const stopData = {
      id: 8,
      orderNumber: 8,
      title: "Jordaan District – Westerkerk and Anne Frank House",
      description: "Our final stop brings us to the charming Jordaan district with its two landmark buildings: the Westerkerk church and Anne Frank House. Let's start with the Westerkerk (Western Church). This Protestant church was built from 1620 to 1631 in Renaissance style – its tall blue tower dominates the skyline. Standing 85 meters (279 feet) high, it's the tallest church tower in Amsterdam. You might recognize its crown-shaped spire, topped with the blue Emperor's Crown of Maximilian I. Fun fact: Rembrandt is buried here. The famous painter died poor and was laid to rest in an unmarked grave somewhere in the Westerkerk (the exact spot is not known). And just so the kids know, the carillon (the tower's bells) plays 'Tuning the Blue,' the tune on every hour. If you've been hearing a pretty bell melody throughout the city, this is likely the source. Adjacent to the church sits a rather ordinary-looking brick building housing the extraordinary Anne Frank House museum. This was where the Frank family and four others hid in an annex at the back of the building, concealed behind a bookcase door, for more than two years during Nazi occupation. Anne's diary, written during her time in hiding, became one of the most powerful testimonies to the Holocaust. The museum preserves the actual hiding place (though unfurnished as Otto Frank wanted) and displays photos, original diary pages, and artifacts like Anne's scrapbook. The Jordaan neighborhood surrounding us started as a working-class area in the 17th century, named possibly after the French word for garden (jardin). Once crowded and poor, it's now one of Amsterdam's most sought-after areas, known for its cozy cafés, galleries, street musicians, and authentic feel. Look down the charming side streets: you'll notice small inner courtyards called 'hofjes.' These were early social housing often built by wealthy benefactors for elderly women. Today they remain peaceful urban oases. So while we're standing in the Jordaan, let's talk about the hofjes scattered throughout the neighborhood. Unlike the Begijnhof we visited earlier (which is larger and was for religious women), hofjes were typically almshouses built around central gardens. Generous merchants would fund these to care for the elderly, widows, or orphans. Today, the Jordaan has 30+ hidden hofjes tucked away behind unassuming doors and passages (most are still residential and not all are open to visitors). It's a great detail to know if you explore more on your own. When Amsterdam's wealth and international trade grew, it became a city of tolerance and refuge. The Jewish community Anne Frank's family belonged to before going into hiding was a long-established part of Amsterdam's diverse cultural fabric, along with French Huguenots and others seeking freedom.",
      kidsContent: "Look at this tall church! It has a blue crown on the top of its tower. A very famous painter named Rembrandt is buried somewhere inside. Right next to it is the house where Anne Frank and her family hid during World War II. Anne was a teenager who wrote a diary about her life in hiding. Her hiding place was behind a bookcase – like a secret room! In this neighborhood, people have planted flowers everywhere – look for window boxes full of blooms. Fun fact: There are hidden courtyards called 'hofjes' behind some of the buildings around here. They're like secret gardens in the middle of the city! And if you're here in spring, you might spot many cats sunning themselves in the windowsills of Jordaan houses – they love basking in the sun just as much as the locals do!"
    };
    
    // Generate the transcript
    const transcript = generateTranscript(stopData);
    
    console.log('Generating audio for Stop 8: Jordaan District – Westerkerk and Anne Frank House...');
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: transcript,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop8.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating stop audio:', error);
  }
}

// Run the script
generateStop8Audio();