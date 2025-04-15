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

// Function to generate audio for a single stop
async function generateAudioForStop(stop) {
  try {
    console.log(`Generating audio for Stop ${stop.orderNumber}: ${stop.title}...`);
    
    // Generate the transcript
    const transcript = generateTranscript(stop);
    
    // Call OpenAI's text-to-speech API
    const mp3 = await openai.audio.speech.create({
      model: "tts-1", // Basic TTS model
      voice: "fable", // British accent, good for storytelling
      input: transcript,
    });
    
    // Convert the response to buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());
    
    // Create filename
    const fileName = `stop${stop.orderNumber}.mp3`;
    const outputPath = path.join('public/audio', fileName);
    
    // Save the audio file
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`Audio saved to ${outputPath}`);
    
    return outputPath;
    
  } catch (error) {
    console.error(`Error generating audio for Stop ${stop.orderNumber}:`, error);
    return null;
  }
}

// Function to load tour stops data
async function loadTourStops() {
  return [
    {
      id: 1,
      orderNumber: 1,
      title: "NEMO Science Museum",
      description: "We begin at NEMO Science Museum, the large green building shaped like a ship's hull rising from the water. This striking structure was designed by famed architect Renzo Piano and opened in 1997. Renzo Piano wanted NEMO to evoke Amsterdam's seafaring history – indeed, it looks like a giant ship emerging from the harbor! Standing here, you might imagine you're on the bow of a boat about to sail. NEMO is actually built atop a tunnel that runs under the water, and its roof doubles as a public square with cascading steps. Inside NEMO are five floors of hands-on science exhibits (the largest science center in the Netherlands), where kids and adults can experiment and play. If you have time after the tour, it's worth a visit – you can blow giant soap bubbles or conduct electricity with a human chain! For now, let's head up to the rooftop terrace. From the top, you get a panoramic view of Amsterdam's old city center. Point out the spires and towers you see: in the distance, you might spot a tall white clock tower – that's our next stop, the Montelbaanstoren. You can also see the busy harbor below, with boats and the replica 18th-century ship at the Maritime Museum nearby. Take a moment to soak in the view and snap a family photo with Amsterdam's skyline.",
      kidsContent: "Inside NEMO are five floors of hands-on science exhibits, where kids and adults can experiment and play. You can blow giant bubbles and learn about water, electricity, and light through fun activities! Fun fact: The roof of NEMO is actually a public square where you can see a great view of Amsterdam! Kids, try a fun challenge: can you count how many church towers you see from up here?"
    },
    {
      id: 2,
      orderNumber: 2,
      title: "Montelbaanstoren",
      description: "Here we are at Montelbaanstoren, a picturesque 16th-century tower on the canal Oudeschans. This brick tower was originally built around 1512–1516 as part of Amsterdam's medieval city wall. Imagine back then: city guards stood watch here, scanning for enemy ships on the waterways. In fact, the tower's base is one of the last remnants of Amsterdam's old defensive walls. As you look up, notice the upper section is a different color – the elegant cream-colored clock tower was added later, in 1606, to make the tower look more attractive when the walls were no longer used. Montelbaanstoren has a fun nickname: 'Malle Jaap,' meaning 'Silly Jack' in Dutch. Why silly? Well, when the new clock and bells were installed, they had a mind of their own – the bells would often chime at odd hours or not at all, confusing everyone! The townspeople joked that the tower was a bit crazy, and the nickname stuck. You might share a laugh imagining the bell ringing in the middle of the night by accident, causing folks to check their watches. This spot was also a gathering point for sailors in the 1600s. In Amsterdam's Golden Age, sailors would meet at the base of this tower before embarking on long voyages. Picture them in old-timey clothes, hugging their families goodbye next to this very canal. Perhaps a sailor's children back then found comfort seeing the Montelbaanstoren – much like a lighthouse – as their father's ship drifted away to sea. Storytelling tip for kids: Maybe a family of ducks in the canal 'quacked' along when the bells misfired, giving the sailors a funny send-off! Today, Montelbaanstoren stands peacefully by houseboats and bikes, a reminder of Amsterdam's maritime past. Take a look around: houseboats line the canal here, and locals relax on benches when the sun is out. It's a great spot for a short rest. Feel the old brick wall of the tower – it's over 500 years old! You are literally touching history.",
      kidsContent: "Montelbaanstoren has a fun nickname: 'Malle Jaap,' meaning 'Silly Jack' in Dutch. Why silly? Well, when the new clock and bells were installed, they had a mind of their own – the bells would often chime at odd hours or not at all, confusing everyone! You might share a laugh imagining the bell ringing in the middle of the night by accident, causing folks to check their watches. Ask the kids: What would you nickname a tower that rings whenever it wants? Silly Jack seems just right! Kids can count the floors and windows on the tower or wave at any passing canal boat. When you hear the modern chime of the clock (it behaves nowadays, ringing on the hour), you'll know time's up to move on."
    },
    {
      id: 3,
      orderNumber: 3,
      title: "Nieuwmarkt & Lunch at In de Waag",
      description: "Welcome to Nieuwmarkt, a lively square that has been a center of commerce for centuries. In Dutch, Nieuwmarkt means 'New Market,' and indeed markets have been held here since the 17th century when this area became a public square. The star of Nieuwmarkt is the Waag, the dramatic medieval building in the center that looks like a little castle with pointed towers. Believe it or not, this is one of Amsterdam's oldest buildings – built in 1488 as a city gate known as St. Anthony's Gate. Back then, Amsterdam's city wall ran right here, and this gate allowed entry into the city (imagine huge wooden doors and a drawbridge over a moat!). When the city expanded, the walls came down, and by 1614 the moat around the gate was filled to create this market square. The old gate was repurposed as a weigh house, or 'Waag,' where merchants would weigh and trade goods like grain and butter. If you look up at the building, you can still spot stone plaques and symbols of the guilds that used it: one tower was used by the blacksmiths' guild, another by the masons, and even the surgeons' guild had their meeting room here. In fact, a famous event took place inside: in 1632 the surgeons commissioned the artist Rembrandt to paint an anatomy lesson here – that painting ('The Anatomy Lesson of Dr. Tulp') became world-famous! Today the Waag hosts a café/restaurant called In de Waag – and it's our lunch stop. Fun fact: The Waag is the oldest non-religious building in Amsterdam!",
      kidsContent: "This old building used to be a city gate where people entered Amsterdam. Later it became a place where they weighed goods like cheese and butter to make sure no one was cheating! Different groups of workers like blacksmiths and masons each had their own special room in the building. Ask your kids what they'd trade if this were a market in the old days – tulip bulbs? Spices? Or maybe their allowance for a stroopwafel?"
    },
    {
      id: 4,
      orderNumber: 4,
      title: "Zeedijk and Fo Guang Shan He Hua Temple",
      description: "As we walk along Zeedijk, you might feel like we've traveled to a different country! Welcome to Amsterdam's small but vibrant Chinatown. The street name Zeedijk means 'Sea Dike' – centuries ago, this street was a dike holding back the waters of the IJ bay. Sailors from all over the world came ashore here, and in the 20th century Chinese sailors and merchants settled in this area, creating Chinatown. Right in front of us is the Fo Guang Shan He Hua Temple, the largest Buddhist temple in Europe built in traditional Chinese style. Its architecture is hard to miss: a grand entry with tiled green-and-gold roof, carved dragons, and a bright red façade. This beautiful temple, also known simply as He Hua Temple (荷華寺), was inaugurated in 2000 – even Queen Beatrix of the Netherlands came to open it officially on September 15, 2000. 'He Hua' means 'Lotus Flower' in Chinese, symbolizing purity. It's also a clever nod to the Netherlands (荷兰 Helan is 'Holland' in Chinese, using the same character '荷' for lotus). So the temple's name connects the Dutch and Chinese cultures in one phrase – pretty neat! Take a moment to admire the intricate details on the temple's exterior. The large red doors might be open during the day – if so, you are welcome to step inside quietly (just be respectful: turn off flashes, and note that photography may be restricted).",
      kidsContent: "Look at the special temple with its colorful roof and dragons! This is a Buddhist temple where people come to pray and be peaceful. There are two stone lions at the entrance to protect the temple. Can you find any animals or mythical creatures carved on the roof? Dragons and phoenixes are common in Chinese temples – see if you can spot them! If the kids need a sweet snack, you can pop into a Chinese bakery on Zeedijk for an egg tart or bubble tea. They might get a kick out of seeing Chinese zodiac animals on decorations or colorful posters for the next Lunar New Year festival."
    },
    {
      id: 5,
      orderNumber: 5,
      title: "Dam Square",
      description: "Welcome to Dam Square, the very heart of Amsterdam. This sprawling plaza is often bustling with life – you'll likely see street performers, pigeons fluttering about, locals on bikes cutting across, and tourists snapping photos. Take a 360° look: on one side stands the grand Royal Palace with its classical facade and green-domed tower, and next to it the Gothic windows of the Nieuwe Kerk (New Church). In the middle of the square is a tall white stone pillar – that's the National Monument, honoring the victims of World War II. It's called Dam Square because this is literally where Amsterdam began – as a dam on the Amstel River in the 13th century. The city's name, Amsteldam, comes from 'dam on the Amstel.' Standing here, you're on what was once a simple dam holding back river water. The Royal Palace was built in the 17th century, not originally as a palace but as Amsterdam's City Hall during the Dutch Golden Age. At that time, it was touted as the largest administrative building in Europe, even called the 'Eighth Wonder of the World.' In the 19th century, it became a royal palace. Look up at the very top of the palace. Can you see the statue of Atlas holding a globe on his shoulders? That's from Greek mythology – Atlas holding up the sky. That statue is actually over three meters tall, but looks small from down here! Also notice the palace's roof has a little tower with a weather vane ship – a nod to Amsterdam's seafaring wealth.",
      kidsContent: "This big square is where Amsterdam started! It used to be a real dam that stopped the water from flooding the city. Now it's where people hang out and meet. Can you find the big white pillar monument? It's a special place to remember brave people from a long time ago. Look at the fancy building – that's where the king of the Netherlands sometimes works! Fun sight game: Look up at the very top of the palace. Can you see the statue of Atlas holding a globe on his shoulders? That's from Greek mythology – Atlas holding up the sky."
    },
    {
      id: 6,
      orderNumber: 6,
      title: "Begijnhof",
      description: "Stepping through the gate into the Begijnhof is like entering a tranquil oasis hidden from the city buzz. Please remember to speak softly here, as this is a private residential courtyard. Take in the scene: neat lawn and gardens, surrounded by a ring of historic houses with gabled roofs, some brick, some with big windows, all beautifully kept. In the center stands a small white chapel. It's hard to believe noisy Kalverstraat is just a minute away – in here, you might only hear birds chirping. The Begijnhof dates back to the 14th century and was originally built as a community for the Beguines – pious women who lived in a sisterhood here. These women were not nuns (they didn't take permanent vows), but they lived a semi-religious life devoted to charity and prayer, while still participating in the world. Think of them as an early girl-power community – they were independent, unmarried women in an age when that was uncommon. The Beguines supported themselves (some were nurses, some made lace or taught children) and they could leave to marry if they chose. The last Beguine lived here until 1971, remarkably! So this courtyard was in continuous use by Beguines for over 600 years. Today, single women (not Beguines) still reside in these houses, preserving the tradition of a women's sanctuary. Look around for the oldest wooden house in Amsterdam. Along one side of the courtyard, you'll notice a black-painted house with white framing (Begijnhof #34). That is the Houten Huys, dating from around 1420. It has a gothic wooden facade and is one of only two wooden houses left in the center of Amsterdam (wooden buildings were largely banned in 1521 due to fire risk).",
      kidsContent: "We're entering a secret garden hidden in the middle of the city! Long ago, a group of special women called Beguines lived here. They weren't nuns, but they were religious and helped take care of sick people. Can you spot the oldest wooden house in Amsterdam? It's over 600 years old and painted black with white trim! Look at how the houses face inward to this peaceful garden, like they're hiding from the busy city. It's incredible that this humble dark house has stood here while the world changed around it – from the days of knights and plagues to the age of smartphones."
    },
    {
      id: 7,
      orderNumber: 7,
      title: "The Canal Belt & The Nine Streets",
      description: "Now we find ourselves amid Amsterdam's famous Canal Belt, a UNESCO World Heritage site of concentric canals dug in the 17th century. Take a look at the view down the canal – it's postcard-perfect: water reflecting the sky, arched bridges decorated with flower boxes, and rows of narrow, tall canal houses shoulder-to-shoulder. Amsterdam has 165 canals totaling over 100 km, which is why it's often called the 'Venice of the North.' But fun fact: Amsterdam actually has more bridges than Venice (around 1,500 of them!). The canals were not just for beauty – they served as transport highways and helped expand the city in a planned way during the Dutch Golden Age. We are in the Nine Streets (De 9 Straatjes), a charming grid of (you guessed it) nine little streets connecting the main canals. These streets have quirky names like Hartenstraat (Heart Street) and Berenstraat (Bear Street). Historically, many were named after the leather tanners and other trades that operated here (for example, Huidenstraat means 'Leather Street'). Today, the Nine Streets are filled with cozy cafés, vintage boutiques, art galleries, and design shops. It's a shopper's paradise and a lovely area to wander. The kids might not be into boutique shopping, but there are toy stores and an old-fashioned candy shop somewhere around here if you look – and plenty of spots for a treat. Keep an eye out for a cheese shop with free samples – those are always a hit! As we stroll, notice the architecture of the canal houses. Most are narrow and tall, often 3-4 stories, with ornately shaped gables (the top part of the facade). Why so narrow? Because historically, houses were taxed on their width along the canal, so people built slender homes to save money. (Kids, imagine if your house's tax was based on how wide your front door is – you'd build a skinny house too!) Some houses here are extremely narrow – the narrowest house in Amsterdam is about as wide as a door! These tall houses often lean slightly forward and have a hook or beam at the top. Look up and you'll spot hoisting hooks on many gables. They are functional: since staircases inside are very tight and steep, people use those hooks to hoist furniture and goods up through the windows. You might even catch someone moving a couch via the window – it still happens regularly. It's a real-life physics lesson: pulleys at work! Walking through the Nine Streets, enjoy the canal vistas at each crossing. We'll likely cross three main canals: Herengracht (Gentlemen's Canal), Keizersgracht (Emperor's Canal), and Prinsengracht (Prince's Canal). Each intersection offers a classic view – be sure to take a family photo on a bridge with canal and bikes in the background. Maybe even do a funny pose imitating the crooked houses (some old houses tilt due to settling ground). This area is also great to point out the typical Dutch lifestyle along canals: people actually live in those canal houses and even on the water in houseboats moored along the sides. Houseboats often have plants and chairs on their decks – a floating front yard. The canals are alive – you might see locals kayaking, families on small motorboats cruising by, or ducks paddling in formation.",
      kidsContent: "Look at all these pretty canals and fancy houses! These canals were dug over 400 years ago to help ships bring goods into the city. The houses are tall and skinny because people had to pay taxes based on how wide their house was along the canal. The skinnier the house, the less tax they paid! These nine small streets are named after crafts that people used to do here long ago, like making gloves or barrels. Now they're full of cool shops where you can find things you won't see anywhere else! One fun activity: count the bicycles parked on the bridge. Amsterdam has more bikes than people – about 800,000 bikes! You'll see them chained everywhere, like an explosion of two-wheelers. And unfortunately, a lot end up in the canals – roughly 12,000–15,000 bikes are fished out of the canals each year. Imagine scuba divers picking up rusted bicycles from the canal floor – what a job! Maybe pop into a sweet shop for a quick treat – Dutch drop (licorice) is famous (though be warned, the salty kind is an acquired taste!), or get a fresh warm stroopwafel made in front of you – the chewy caramel syrup between waffle layers is delightful."
    },
    {
      id: 8,
      orderNumber: 8,
      title: "Jordaan District – Westerkerk and Anne Frank House",
      description: "Our final stop brings us to the charming Jordaan district with its two landmark buildings: the Westerkerk church and Anne Frank House. Let's start with the Westerkerk (Western Church). This Protestant church was built from 1620 to 1631 in Renaissance style – its tall blue tower dominates the skyline. Standing 85 meters (279 feet) high, it's the tallest church tower in Amsterdam. You might recognize its crown-shaped spire, topped with the blue Emperor's Crown of Maximilian I. Fun fact: Rembrandt is buried here. The famous painter died poor and was laid to rest in an unmarked grave somewhere in the Westerkerk (the exact spot is not known). And just so the kids know, the carillon (the tower's bells) plays 'Tuning the Blue,' the tune on every hour. If you've been hearing a pretty bell melody throughout the city, this is likely the source. Adjacent to the church sits a rather ordinary-looking brick building housing the extraordinary Anne Frank House museum. This was where the Frank family and four others hid in an annex at the back of the building, concealed behind a bookcase door, for more than two years during Nazi occupation. Anne's diary, written during her time in hiding, became one of the most powerful testimonies to the Holocaust. The museum preserves the actual hiding place (though unfurnished as Otto Frank wanted) and displays photos, original diary pages, and artifacts like Anne's scrapbook. The Jordaan neighborhood surrounding us started as a working-class area in the 17th century, named possibly after the French word for garden (jardin). Once crowded and poor, it's now one of Amsterdam's most sought-after areas, known for its cozy cafés, galleries, street musicians, and authentic feel. Look down the charming side streets: you'll notice small inner courtyards called 'hofjes.' These were early social housing often built by wealthy benefactors for elderly women. Today they remain peaceful urban oases. So while we're standing in the Jordaan, let's talk about the hofjes scattered throughout the neighborhood. Unlike the Begijnhof we visited earlier (which is larger and was for religious women), hofjes were typically almshouses built around central gardens. Generous merchants would fund these to care for the elderly, widows, or orphans. Today, the Jordaan has 30+ hidden hofjes tucked away behind unassuming doors and passages (most are still residential and not all are open to visitors). It's a great detail to know if you explore more on your own. When Amsterdam's wealth and international trade grew, it became a city of tolerance and refuge. The Jewish community Anne Frank's family belonged to before going into hiding was a long-established part of Amsterdam's diverse cultural fabric, along with French Huguenots and others seeking freedom.",
      kidsContent: "Look at this tall church! It has a blue crown on the top of its tower. A very famous painter named Rembrandt is buried somewhere inside. Right next to it is the house where Anne Frank and her family hid during World War II. Anne was a teenager who wrote a diary about her life in hiding. Her hiding place was behind a bookcase – like a secret room! In this neighborhood, people have planted flowers everywhere – look for window boxes full of blooms. Fun fact: There are hidden courtyards called 'hofjes' behind some of the buildings around here. They're like secret gardens in the middle of the city! And if you're here in spring, you might spot many cats sunning themselves in the windowsills of Jordaan houses – they love basking in the sun just as much as the locals do!"
    }
  ];
}

// Main function to generate all audio
async function generateAllAudio() {
  try {
    // Load tour stops data
    const tourStops = await loadTourStops();
    
    console.log(`Starting audio generation for ${tourStops.length} tour stops...`);
    
    // Generate audio for each stop sequentially
    for (const stop of tourStops) {
      await generateAudioForStop(stop);
    }
    
    console.log('All audio files generated successfully!');
    
  } catch (error) {
    console.error('Error generating all audio:', error);
  }
}

// Run the script
generateAllAudio();