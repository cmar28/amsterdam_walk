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

// The available voice options from OpenAI
const VOICES = {
  alloy: 'alloy',      // Neutral/versatile voice
  echo: 'echo',        // Crisp and clear voice
  fable: 'fable',      // British accent, expressive, good for storytelling
  onyx: 'onyx',        // Deep and authoritative voice
  nova: 'nova',        // Female voice, warm and pleasant
  shimmer: 'shimmer',  // Gentle female voice, clear articulation
};

// Choose the voice for our tour guide (fable is good for storytelling)
const TOUR_GUIDE_VOICE = VOICES.fable;

// Load tour stops data from server/storage.js
async function loadTourStops() {
  try {
    // Import directly from storage
    const { storage } = await import('../server/storage.js');
    return await storage.getTourStops();
  } catch (error) {
    console.error('Error loading tour stops:', error);
    return [];
  }
}

// Function to generate transcript with kids content
function generateTranscript(stop) {
  // Combine description with kids content for a complete transcript
  let transcript = stop.description;
  
  if (stop.kidsContent) {
    transcript += `\n\nFor Kids:\n${stop.kidsContent}`;
  }
  
  return transcript;
}

// Function to generate and save audio for a stop
async function generateAudioForStop(stop) {
  try {
    console.log(`Generating audio for stop #${stop.orderNumber}: ${stop.title}`);
    
    // Generate the transcript
    const transcript = generateTranscript(stop);
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: TOUR_GUIDE_VOICE,
      input: transcript,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename based on stop number and slugified title
    const fileName = `stop${stop.orderNumber}_${stop.title.toLowerCase().replace(/\s+/g, '_')}.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio saved to ${outputPath}`);
    
    // Return the audio relative URL for use in the app
    return `/api/audio/${fileName}`;
  } catch (error) {
    console.error(`Error generating audio for ${stop.title}:`, error);
    return null;
  }
}

// Main function to generate all audio files
async function generateAllAudio() {
  try {
    // Load tour stops from the storage
    const tourStops = await loadTourStops();
    
    if (!tourStops || tourStops.length === 0) {
      console.error('No tour stops found');
      return;
    }
    
    console.log(`Found ${tourStops.length} tour stops. Starting audio generation...`);
    
    // Sort tour stops by order number
    const sortedStops = [...tourStops].sort((a, b) => a.orderNumber - b.orderNumber);
    
    // Process each stop and collect audio URLs
    const audioUrls = [];
    
    // Generate audio for each stop
    for (const stop of sortedStops) {
      const audioUrl = await generateAudioForStop(stop);
      if (audioUrl) {
        audioUrls.push({ stopId: stop.id, audioUrl });
      }
    }
    
    console.log('Audio generation complete!');
    console.log('Audio URLs:', audioUrls);
    
    // You can optionally save the audio URLs to a file for reference
    fs.writeFileSync('audio-urls.json', JSON.stringify(audioUrls, null, 2));
    
  } catch (error) {
    console.error('Error generating audio:', error);
  }
}

// Run the script
generateAllAudio();