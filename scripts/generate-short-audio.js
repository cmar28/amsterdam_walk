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

async function generateShortAudio() {
  try {
    // Generate short versions of audio for all stops
    for (let i = 1; i <= 8; i++) {
      console.log(`Generating short audio for Stop ${i}...`);
      
      // Short intro text for each stop
      const texts = [
        "Welcome to NEMO Science Museum, where we begin our Amsterdam tour. This striking green building was designed to resemble a ship's hull rising from the water, a nod to Amsterdam's rich maritime history.",
        "Here we are at Montelbaanstoren, a picturesque 16th-century tower. This brick tower was built around 1512 as part of Amsterdam's medieval city wall, where guards kept watch for enemies approaching by water.",
        "Welcome to Nieuwmarkt, a lively square with the dramatic medieval Waag building at its center. The Waag dates back to 1488 and was originally a city gate before becoming a weighing house for merchants.",
        "As we walk along Zeedijk, we enter Amsterdam's vibrant Chinatown. Right in front of us is the Fo Guang Shan He Hua Temple, the largest Buddhist temple in Europe built in traditional Chinese style.",
        "Welcome to Dam Square, the very heart of Amsterdam. This sprawling plaza marks where the city began - as a dam on the Amstel River in the 13th century, giving Amsterdam its name.",
        "Stepping through the gate into the Begijnhof is like entering a tranquil oasis. This hidden courtyard dates back to the 14th century and served as a community for the Beguines - pious women who lived in a religious sisterhood.",
        "Now we find ourselves amid Amsterdam's famous Canal Belt, a UNESCO World Heritage site of concentric canals dug in the 17th century. We're in the Nine Streets area, a charming grid connecting the main canals.",
        "Our final stop brings us to the charming Jordaan district with its two landmark buildings: the Westerkerk church and Anne Frank House. The Westerkerk's tall blue tower dominates the skyline of Amsterdam."
      ];
      
      // Call OpenAI's text-to-speech API
      const mp3 = await openai.audio.speech.create({
        model: "tts-1", // Basic TTS model
        voice: "fable", // British accent, good for storytelling
        input: texts[i-1],
      });
      
      // Convert the response to buffer
      const buffer = Buffer.from(await mp3.arrayBuffer());
      
      // Create filename
      const fileName = `stop${i}_short.mp3`;
      const outputPath = path.join('public/audio', fileName);
      
      // Save the audio file
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`Short audio saved to ${outputPath}`);
    }
    
    console.log('All short audio files generated successfully!');
    
  } catch (error) {
    console.error('Error generating short audio:', error);
  }
}

// Run the script
generateShortAudio();