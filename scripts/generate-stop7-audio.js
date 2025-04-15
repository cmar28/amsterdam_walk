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

async function generateStop7Audio() {
  try {
    // The Canal Belt & The Nine Streets data
    const stopData = {
      id: 7,
      orderNumber: 7,
      title: "The Canal Belt & The Nine Streets",
      description: "Now we find ourselves amid Amsterdam's famous Canal Belt, a UNESCO World Heritage site of concentric canals dug in the 17th century. Take a look at the view down the canal – it's postcard-perfect: water reflecting the sky, arched bridges decorated with flower boxes, and rows of narrow, tall canal houses shoulder-to-shoulder. Amsterdam has 165 canals totaling over 100 km, which is why it's often called the 'Venice of the North.' But fun fact: Amsterdam actually has more bridges than Venice (around 1,500 of them!). The canals were not just for beauty – they served as transport highways and helped expand the city in a planned way during the Dutch Golden Age. We are in the Nine Streets (De 9 Straatjes), a charming grid of (you guessed it) nine little streets connecting the main canals. These streets have quirky names like Hartenstraat (Heart Street) and Berenstraat (Bear Street). Historically, many were named after the leather tanners and other trades that operated here (for example, Huidenstraat means 'Leather Street'). Today, the Nine Streets are filled with cozy cafés, vintage boutiques, art galleries, and design shops. It's a shopper's paradise and a lovely area to wander. The kids might not be into boutique shopping, but there are toy stores and an old-fashioned candy shop somewhere around here if you look – and plenty of spots for a treat. Keep an eye out for a cheese shop with free samples – those are always a hit! As we stroll, notice the architecture of the canal houses. Most are narrow and tall, often 3-4 stories, with ornately shaped gables (the top part of the facade). Why so narrow? Because historically, houses were taxed on their width along the canal, so people built slender homes to save money. (Kids, imagine if your house's tax was based on how wide your front door is – you'd build a skinny house too!) Some houses here are extremely narrow – the narrowest house in Amsterdam is about as wide as a door! These tall houses often lean slightly forward and have a hook or beam at the top. Look up and you'll spot hoisting hooks on many gables. They are functional: since staircases inside are very tight and steep, people use those hooks to hoist furniture and goods up through the windows. You might even catch someone moving a couch via the window – it still happens regularly. It's a real-life physics lesson: pulleys at work! Walking through the Nine Streets, enjoy the canal vistas at each crossing. We'll likely cross three main canals: Herengracht (Gentlemen's Canal), Keizersgracht (Emperor's Canal), and Prinsengracht (Prince's Canal). Each intersection offers a classic view – be sure to take a family photo on a bridge with canal and bikes in the background. Maybe even do a funny pose imitating the crooked houses (some old houses tilt due to settling ground). This area is also great to point out the typical Dutch lifestyle along canals: people actually live in those canal houses and even on the water in houseboats moored along the sides. Houseboats often have plants and chairs on their decks – a floating front yard. The canals are alive – you might see locals kayaking, families on small motorboats cruising by, or ducks paddling in formation.",
      kidsContent: "Look at all these pretty canals and fancy houses! These canals were dug over 400 years ago to help ships bring goods into the city. The houses are tall and skinny because people had to pay taxes based on how wide their house was along the canal. The skinnier the house, the less tax they paid! These nine small streets are named after crafts that people used to do here long ago, like making gloves or barrels. Now they're full of cool shops where you can find things you won't see anywhere else! One fun activity: count the bicycles parked on the bridge. Amsterdam has more bikes than people – about 800,000 bikes! You'll see them chained everywhere, like an explosion of two-wheelers. And unfortunately, a lot end up in the canals – roughly 12,000–15,000 bikes are fished out of the canals each year. Imagine scuba divers picking up rusted bicycles from the canal floor – what a job! Maybe pop into a sweet shop for a quick treat – Dutch drop (licorice) is famous (though be warned, the salty kind is an acquired taste!), or get a fresh warm stroopwafel made in front of you – the chewy caramel syrup between waffle layers is delightful."
    };
    
    // Generate the transcript
    const transcript = generateTranscript(stopData);
    
    console.log('Generating audio for Stop 7: The Canal Belt & The Nine Streets...');
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: transcript,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop7.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio saved to ${outputPath}`);
    
  } catch (error) {
    console.error('Error generating stop audio:', error);
  }
}

// Run the script
generateStop7Audio();