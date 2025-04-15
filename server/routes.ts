import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

// Initialize with tour data if needed
async function initializeTourData() {
  // Tour stops from NEMO to Jordaan
  const tourStops = [
    {
      title: "NEMO Science Museum",
      subtitle: "Starting point - The distinctive green hull-shaped museum",
      description: "We begin at NEMO Science Museum, the large green building shaped like a ship's hull rising from the water. This striking structure was designed by famed architect Renzo Piano and opened in 1997. Renzo Piano wanted NEMO to evoke Amsterdam's seafaring history – indeed, it looks like a giant ship emerging from the harbor! Standing here, you might imagine you're on the bow of a boat about to sail. NEMO is actually built atop a tunnel that runs under the water, and its roof doubles as a public square with cascading steps. Inside NEMO are five floors of hands-on science exhibits (the largest science center in the Netherlands), where kids and adults can experiment and play. If you have time after the tour, it's worth a visit – you can blow giant soap bubbles or conduct electricity with a human chain! For now, let's head up to the rooftop terrace. From the top, you get a panoramic view of Amsterdam's old city center. Point out the spires and towers you see: in the distance, you might spot a tall white clock tower – that's our next stop, the Montelbaanstoren. You can also see the busy harbor below, with boats and the replica 18th-century ship at the Maritime Museum nearby. Take a moment to soak in the view and snap a family photo with Amsterdam's skyline.",
      kidsContent: "Inside NEMO are five floors of hands-on science exhibits, where kids and adults can experiment and play. You can blow giant bubbles and learn about water, electricity, and light through fun activities! Fun fact: The roof of NEMO is actually a public square where you can see a great view of Amsterdam! Kids, try a fun challenge: can you count how many church towers you see from up here?",
      orderNumber: 1,
      latitude: 52.374175,
      longitude: 4.912442,
      audioUrl: "/api/audio/stop1_full.mp3", // Full audio narration for Stop 1
      duration: "10 minutes",
      nextStopWalkingTime: "5-7 minutes",
      walkingTip: "From NEMO, walk west along the pedestrian bridge and follow the waterfront path towards the small canal. Keep the water on your right. Montelbaanstoren – the old brick tower with a white steeple – will be straight ahead on the canal bank.",
      images: ["/api/images/nemo1.jpg", "/api/images/nemo2.jpg"]
    },
    {
      title: "Montelbaanstoren",
      subtitle: "Medieval Tower - The old brick tower with a white steeple",
      description: "Here we are at Montelbaanstoren, a picturesque 16th-century tower on the canal Oudeschans. This brick tower was originally built around 1512–1516 as part of Amsterdam's medieval city wall. Imagine back then: city guards stood watch here, scanning for enemy ships on the waterways. In fact, the tower's base is one of the last remnants of Amsterdam's old defensive walls. As you look up, notice the upper section is a different color – the elegant cream-colored clock tower was added later, in 1606, to make the tower look more attractive when the walls were no longer used. Montelbaanstoren has a fun nickname: 'Malle Jaap,' meaning 'Silly Jack' in Dutch. Why silly? Well, when the new clock and bells were installed, they had a mind of their own – the bells would often chime at odd hours or not at all, confusing everyone! The townspeople joked that the tower was a bit crazy, and the nickname stuck. You might share a laugh imagining the bell ringing in the middle of the night by accident, causing folks to check their watches. This spot was also a gathering point for sailors in the 1600s. In Amsterdam's Golden Age, sailors would meet at the base of this tower before embarking on long voyages. Picture them in old-timey clothes, hugging their families goodbye next to this very canal. Perhaps a sailor's children back then found comfort seeing the Montelbaanstoren – much like a lighthouse – as their father's ship drifted away to sea. Storytelling tip for kids: Maybe a family of ducks in the canal 'quacked' along when the bells misfired, giving the sailors a funny send-off! Today, Montelbaanstoren stands peacefully by houseboats and bikes, a reminder of Amsterdam's maritime past. Take a look around: houseboats line the canal here, and locals relax on benches when the sun is out. It's a great spot for a short rest. Feel the old brick wall of the tower – it's over 500 years old! You are literally touching history.",
      kidsContent: "Montelbaanstoren has a fun nickname: 'Malle Jaap,' meaning 'Silly Jack' in Dutch. Why silly? Well, when the new clock and bells were installed, they had a mind of their own – the bells would often chime at odd hours or not at all, confusing everyone! You might share a laugh imagining the bell ringing in the middle of the night by accident, causing folks to check their watches. Ask the kids: What would you nickname a tower that rings whenever it wants? Silly Jack seems just right! Kids can count the floors and windows on the tower or wave at any passing canal boat. When you hear the modern chime of the clock (it behaves nowadays, ringing on the hour), you'll know time's up to move on.",
      orderNumber: 2,
      latitude: 52.3712,
      longitude: 4.9087,
      audioUrl: "/api/audio/stop2_full.mp3", // Full audio narration for Stop 2
      duration: "5 minutes",
      nextStopWalkingTime: "5-7 minutes",
      walkingTip: "Cross the bridge next to Montelbaanstoren and continue west down the street Sint Antoniesbreestraat. You'll pass through a short street with shops and then arrive at an open square with a castle-like building in the middle – that's Nieuwmarkt and the Waag.",
      images: ["/api/images/montelbaanstoren1.jpg", "/api/images/montelbaanstoren2.jpg"]
    },
    {
      title: "Nieuwmarkt & Lunch at In de Waag",
      subtitle: "Historic Market Square - The medieval Waag building",
      description: "Welcome to Nieuwmarkt, a lively square that has been a center of commerce for centuries. In Dutch, Nieuwmarkt means 'New Market,' and indeed markets have been held here since the 17th century when this area became a public square. The star of Nieuwmarkt is the Waag, the dramatic medieval building in the center that looks like a little castle with pointed towers. Believe it or not, this is one of Amsterdam's oldest buildings – built in 1488 as a city gate known as St. Anthony's Gate. Back then, Amsterdam's city wall ran right here, and this gate allowed entry into the city (imagine huge wooden doors and a drawbridge over a moat!). When the city expanded, the walls came down, and by 1614 the moat around the gate was filled to create this market square. The old gate was repurposed as a weigh house, or 'Waag,' where merchants would weigh and trade goods like grain and butter. If you look up at the building, you can still spot stone plaques and symbols of the guilds that used it: one tower was used by the blacksmiths' guild, another by the masons, and even the surgeons' guild had their meeting room here. In fact, a famous event took place inside: in 1632 the surgeons commissioned the artist Rembrandt to paint an anatomy lesson here – that painting ('The Anatomy Lesson of Dr. Tulp') became world-famous! Today the Waag hosts a café/restaurant called In de Waag – and it's our lunch stop. Fun fact: The Waag is the oldest non-religious building in Amsterdam!",
      kidsContent: "This old building used to be a city gate where people entered Amsterdam. Later it became a place where they weighed goods like cheese and butter to make sure no one was cheating! Different groups of workers like blacksmiths and masons each had their own special room in the building. Ask your kids what they'd trade if this were a market in the old days – tulip bulbs? Spices? Or maybe their allowance for a stroopwafel?",
      orderNumber: 3,
      latitude: 52.3728,
      longitude: 4.9004,
      audioUrl: "/api/audio/stop3_full_updated.mp3", // Full audio narration for Stop 3 (with complete kids content)
      duration: "45 minutes (including lunch)",
      nextStopWalkingTime: "5 minutes",
      walkingTip: "From the Waag, walk north across the square and take the street Zeedijk heading towards a large Chinese-style gateway in the distance. You'll notice Chinese shops and restaurants as we enter Chinatown.",
      images: ["/api/images/nieuwmarkt1.jpg", "/api/images/waag1.jpg"]
    },
    {
      title: "Zeedijk and Fo Guang Shan He Hua Temple",
      subtitle: "Chinatown - The largest Buddhist temple in Europe",
      description: "As we walk along Zeedijk, you might feel like we've traveled to a different country! Welcome to Amsterdam's small but vibrant Chinatown. The street name Zeedijk means 'Sea Dike' – centuries ago, this street was a dike holding back the waters of the IJ bay. Sailors from all over the world came ashore here, and in the 20th century Chinese sailors and merchants settled in this area, creating Chinatown. Right in front of us is the Fo Guang Shan He Hua Temple, the largest Buddhist temple in Europe built in traditional Chinese style. Its architecture is hard to miss: a grand entry with tiled green-and-gold roof, carved dragons, and a bright red façade. This beautiful temple, also known simply as He Hua Temple (荷華寺), was inaugurated in 2000 – even Queen Beatrix of the Netherlands came to open it officially on September 15, 2000. 'He Hua' means 'Lotus Flower' in Chinese, symbolizing purity. It's also a clever nod to the Netherlands (荷兰 Helan is 'Holland' in Chinese, using the same character '荷' for lotus). So the temple's name connects the Dutch and Chinese cultures in one phrase – pretty neat! Take a moment to admire the intricate details on the temple's exterior. The large red doors might be open during the day – if so, you are welcome to step inside quietly (just be respectful: turn off flashes, and note that photography may be restricted).",
      kidsContent: "Look at the special temple with its colorful roof and dragons! This is a Buddhist temple where people come to pray and be peaceful. There are two stone lions at the entrance to protect the temple. Can you find any animals or mythical creatures carved on the roof? Dragons and phoenixes are common in Chinese temples – see if you can spot them! If the kids need a sweet snack, you can pop into a Chinese bakery on Zeedijk for an egg tart or bubble tea. They might get a kick out of seeing Chinese zodiac animals on decorations or colorful posters for the next Lunar New Year festival.",
      orderNumber: 4,
      latitude: 52.3739,
      longitude: 4.9003,
      audioUrl: "/api/audio/stop4.mp3",
      duration: "10 minutes",
      nextStopWalkingTime: "10 minutes",
      walkingTip: "Continue along Zeedijk which will curve and lead you out of Chinatown. Follow street signs towards 'Dam' or 'Dam Square,' heading southwest. You might pass through a short pedestrian shopping street. Keep an eye out for when the streets open up to a large plaza – that's Dam Square.",
      images: ["/api/images/zeedijk1.jpg", "/api/images/hehua1.jpg"]
    },
    {
      title: "Dam Square",
      subtitle: "City Center & Royal Palace - The heart of Amsterdam",
      description: "Welcome to Dam Square, the very heart of Amsterdam. This sprawling plaza is often bustling with life – you'll likely see street performers, pigeons fluttering about, locals on bikes cutting across, and tourists snapping photos. Take a 360° look: on one side stands the grand Royal Palace with its classical facade and green-domed tower, and next to it the Gothic windows of the Nieuwe Kerk (New Church). In the middle of the square is a tall white stone pillar – that's the National Monument, honoring the victims of World War II. It's called Dam Square because this is literally where Amsterdam began – as a dam on the Amstel River in the 13th century. The city's name, Amsteldam, comes from 'dam on the Amstel.' Standing here, you're on what was once a simple dam holding back river water. The Royal Palace was built in the 17th century, not originally as a palace but as Amsterdam's City Hall during the Dutch Golden Age. At that time, it was touted as the largest administrative building in Europe, even called the 'Eighth Wonder of the World.' In the 19th century, it became a royal palace. Look up at the very top of the palace. Can you see the statue of Atlas holding a globe on his shoulders? That's from Greek mythology – Atlas holding up the sky. That statue is actually over three meters tall, but looks small from down here! Also notice the palace's roof has a little tower with a weather vane ship – a nod to Amsterdam's seafaring wealth.",
      kidsContent: "This big square is where Amsterdam started! It used to be a real dam that stopped the water from flooding the city. Now it's where people hang out and meet. Can you find the big white pillar monument? It's a special place to remember brave people from a long time ago. Look at the fancy building – that's where the king of the Netherlands sometimes works! Fun sight game: Look up at the very top of the palace. Can you see the statue of Atlas holding a globe on his shoulders? That's from Greek mythology – Atlas holding up the sky.",
      orderNumber: 5,
      latitude: 52.373,
      longitude: 4.893,
      audioUrl: "/api/audio/stop5.mp3",
      duration: "15 minutes",
      nextStopWalkingTime: "10 minutes",
      walkingTip: "From Dam Square, head southwest along Kalverstraat, one of Amsterdam's main shopping streets. Continue until you see a small arched gateway on your right – that's the entrance to Begijnhof. It's easy to miss, so watch for a simple arch with 'Begijnhof' written above it.",
      images: ["/api/images/damsquare1.jpg", "/api/images/royalpalace1.jpg"]
    },
    {
      title: "Begijnhof",
      subtitle: "Secret Courtyard of the Beguines - A hidden medieval sanctuary",
      description: "Stepping through the gate into the Begijnhof is like entering a tranquil oasis hidden from the city buzz. Please remember to speak softly here, as this is a private residential courtyard. Take in the scene: neat lawn and gardens, surrounded by a ring of historic houses with gabled roofs, some brick, some with big windows, all beautifully kept. In the center stands a small white chapel. It's hard to believe noisy Kalverstraat is just a minute away – in here, you might only hear birds chirping. The Begijnhof dates back to the 14th century and was originally built as a community for the Beguines – pious women who lived in a sisterhood here. These women were not nuns (they didn't take permanent vows), but they lived a semi-religious life devoted to charity and prayer, while still participating in the world. Think of them as an early girl-power community – they were independent, unmarried women in an age when that was uncommon. The Beguines supported themselves (some were nurses, some made lace or taught children) and they could leave to marry if they chose. The last Beguine lived here until 1971, remarkably! So this courtyard was in continuous use by Beguines for over 600 years. Today, single women (not Beguines) still reside in these houses, preserving the tradition of a women's sanctuary. Look around for the oldest wooden house in Amsterdam. Along one side of the courtyard, you'll notice a black-painted house with white framing (Begijnhof #34). That is the Houten Huys, dating from around 1420. It has a gothic wooden facade and is one of only two wooden houses left in the center of Amsterdam (wooden buildings were largely banned in 1521 due to fire risk).",
      kidsContent: "We're entering a secret garden hidden in the middle of the city! Long ago, a group of special women called Beguines lived here. They weren't nuns, but they were religious and helped take care of sick people. Can you spot the oldest wooden house in Amsterdam? It's over 600 years old and painted black with white trim! Look at how the houses face inward to this peaceful garden, like they're hiding from the busy city. It's incredible that this humble dark house has stood here while the world changed around it – from the days of knights and plagues to the age of smartphones.",
      orderNumber: 6,
      latitude: 52.3685,
      longitude: 4.8899,
      audioUrl: "/api/audio/stop6.mp3",
      duration: "15 minutes",
      nextStopWalkingTime: "15 minutes",
      walkingTip: "Exit Begijnhof the same way you entered and head west. Cross the Singel canal and continue straight until you reach the next set of canals – Herengracht, Keizersgracht, and Prinsengracht. You're now entering the Canal Belt and the Nine Streets area.",
      images: ["/api/images/begijnhof1.jpg", "/api/images/begijnhof2.jpg"]
    },
    {
      title: "The Canal Belt & The Nine Streets",
      subtitle: "Grachtengordel - The iconic canal system and boutique shopping area",
      description: "Now we find ourselves amid Amsterdam's famous Canal Belt, a UNESCO World Heritage site of concentric canals dug in the 17th century. Take a look at the view down the canal – it's postcard-perfect: water reflecting the sky, arched bridges decorated with flower boxes, and rows of narrow, tall canal houses shoulder-to-shoulder. Amsterdam has 165 canals totaling over 100 km, which is why it's often called the 'Venice of the North.' But fun fact: Amsterdam actually has more bridges than Venice (around 1,500 of them!). The canals were not just for beauty – they served as transport highways and helped expand the city in a planned way during the Dutch Golden Age. We are in the Nine Streets (De 9 Straatjes), a charming grid of (you guessed it) nine little streets connecting the main canals. These streets have quirky names like Hartenstraat (Heart Street) and Berenstraat (Bear Street). Historically, many were named after the leather tanners and other trades that operated here (for example, Huidenstraat means 'Leather Street'). Today, the Nine Streets are filled with cozy cafés, vintage boutiques, art galleries, and design shops. It's a shopper's paradise and a lovely area to wander. The kids might not be into boutique shopping, but there are toy stores and an old-fashioned candy shop somewhere around here if you look – and plenty of spots for a treat. Keep an eye out for a cheese shop with free samples – those are always a hit! As we stroll, notice the architecture of the canal houses. Most are narrow and tall, often 3-4 stories, with ornately shaped gables (the top part of the facade). Why so narrow? Because historically, houses were taxed on their width along the canal, so people built slender homes to save money. (Kids, imagine if your house's tax was based on how wide your front door is – you'd build a skinny house too!) Some houses here are extremely narrow – the narrowest house in Amsterdam is about as wide as a door! These tall houses often lean slightly forward and have a hook or beam at the top. Look up and you'll spot hoisting hooks on many gables. They are functional: since staircases inside are very tight and steep, people use those hooks to hoist furniture and goods up through the windows. You might even catch someone moving a couch via the window – it still happens regularly. It's a real-life physics lesson: pulleys at work! Walking through the Nine Streets, enjoy the canal vistas at each crossing. We'll likely cross three main canals: Herengracht (Gentlemen's Canal), Keizersgracht (Emperor's Canal), and Prinsengracht (Prince's Canal). Each intersection offers a classic view – be sure to take a family photo on a bridge with canal and bikes in the background. Maybe even do a funny pose imitating the crooked houses (some old houses tilt due to settling ground). This area is also great to point out the typical Dutch lifestyle along canals: people actually live in those canal houses and even on the water in houseboats moored along the sides. Houseboats often have plants and chairs on their decks – a floating front yard. The canals are alive – you might see locals kayaking, families on small motorboats cruising by, or ducks paddling in formation.",
      kidsContent: "Look at all these pretty canals and fancy houses! These canals were dug over 400 years ago to help ships bring goods into the city. The houses are tall and skinny because people had to pay taxes based on how wide their house was along the canal. The skinnier the house, the less tax they paid! These nine small streets are named after crafts that people used to do here long ago, like making gloves or barrels. Now they're full of cool shops where you can find things you won't see anywhere else! One fun activity: count the bicycles parked on the bridge. Amsterdam has more bikes than people – about 800,000 bikes! You'll see them chained everywhere, like an explosion of two-wheelers. And unfortunately, a lot end up in the canals – roughly 12,000–15,000 bikes are fished out of the canals each year. Imagine scuba divers picking up rusted bicycles from the canal floor – what a job! Maybe pop into a sweet shop for a quick treat – Dutch drop (licorice) is famous (though be warned, the salty kind is an acquired taste!), or get a fresh warm stroopwafel made in front of you – the chewy caramel syrup between waffle layers is delightful.",
      orderNumber: 7,
      latitude: 52.3692,
      longitude: 4.8860,
      audioUrl: "/api/audio/stop7.mp3",
      duration: "30 minutes",
      nextStopWalkingTime: "10 minutes",
      walkingTip: "From the Nine Streets area, continue west until you reach the Prinsengracht canal. Follow it north until you see a tall church tower with a blue crown (the Westerkerk). Nearby, you'll find the Anne Frank House on Prinsengracht. Continue a bit further into the Jordaan district.",
      images: ["/api/images/canals1.jpg", "/api/images/9streets1.jpg"]
    },
    {
      title: "Jordaan District – Westerkerk and Anne Frank House",
      subtitle: "Charming neighborhood - The artistic heart of Amsterdam",
      description: "We conclude our tour in the Jordaan, one of Amsterdam's most beloved neighborhoods. The Jordaan has a cozy, village-like atmosphere with narrow streets, art studios, and cafés with tables on the sidewalk. It was built in the 17th century as a working-class district for artisans and immigrants. Nowadays it's very trendy, but you can still feel the authentic charm – people chatting from their doorsteps, flower boxes in windows, and maybe someone strumming a guitar on a doorstep. Street names here are often flowers and trees (you might see Elandsgracht, Bloemgracht – bloom = flower). Some say the name Jordaan comes from the French word 'Jardin' (garden), reflecting these floral street names or the gardens that once were here. Towering above us is the Westerkerk (Western Church), with its blue crown-topped spire reaching 85 meters high. This is the tallest church tower in Amsterdam. The blue crown is the symbol of Emperor Maximilian of Austria, who gave Amsterdam the right to use his crown in its coat of arms as thanks for support centuries ago. The Westerkerk was completed in 1631 and Rembrandt van Rijn – the famous painter we talked about – is buried somewhere inside (in an unmarked poor man's grave, as he died in poverty). The church is still in use and if you're lucky to be here on the hour, you'll hear its beautiful carillon bells play. Just a few steps away on Prinsengracht 263 is the Anne Frank House. It's the preserved canal house where Anne Frank, a Jewish girl, hid with her family and four others during World War II to escape Nazi persecution. They remained hidden in a secret annex for two years (1942–1944), and during that time Anne, then a teenager, kept a diary that has since touched millions of hearts around the world. From the outside, the Anne Frank House looks like any other canal house – tall, narrow, with big windows (blinds likely drawn). Point out the attic window where Anne could see a chestnut tree and the Westerkerk's clock tower. Anne wrote about hearing the Westerkerk bells and how they cheered her up: 'Father, Mother and Margot still can't get used to the chiming of the Westertoren clock... Not me, I liked it from the start – it sounds so reassuring, especially at night.' Standing here, you might even hear those same bells ring, bridging the past to the present. Anne and her family were eventually discovered and deported; Anne died in a concentration camp in 1945, but her father survived and published her diary. The Jordaan area around us is also known for its music – it's the birthplace of many Dutch folk songs. Sometimes on weekends, you might hear someone singing old Dutch tunes in a café. The Noordermarkt hosts organic farmer's markets and flea markets. It's this blend of culture – from Anne's legacy to Rembrandt's resting place to everyday Dutch living – that makes the Jordaan special.",
      kidsContent: "We're in the Jordaan – once a neighborhood where workers and immigrants lived, now full of art, music, and delicious food! See that tall church tower with the blue crown? That's the Westerkerk, and it plays beautiful bell music. Nearby is the Anne Frank House, where a girl about your age had to hide during wartime and wrote a famous diary. The Jordaan has lots of secret gardens called 'hofjes' hidden between buildings. People play special Dutch folk music here called 'levenslied' during street festivals. It's like a treasure hunt to find all the cool spots! Anne wrote about hearing the Westerkerk bells and how they cheered her up: 'Father, Mother and Margot still can't get used to the chiming of the Westertoren clock... Not me, I liked it from the start – it sounds so reassuring, especially at night.'",
      orderNumber: 8,
      latitude: 52.3744,
      longitude: 4.8839,
      audioUrl: "/api/audio/stop8.mp3",
      duration: "End of tour - explore as long as you wish",
      nextStopWalkingTime: "",
      walkingTip: "Take your time exploring the winding streets, browsing the art galleries, or enjoying a snack at one of the many cafes. The Jordaan is perfect for leisurely wandering.",
      images: ["/api/images/westerkerk1.jpg", "/api/images/jordaan1.jpg", "/api/images/annefrank1.jpg"]
    }
  ];

  // Detailed walking route paths based on the provided description
  const routePaths = [
    {
      // Step 1: NEMO to Montelbaanstoren
      fromStopId: 1,
      toStopId: 2,
      coordinates: [
        {lat: 52.37403, lng: 4.91243}, // NEMO starting point
        {lat: 52.37382, lng: 4.91168}, // Cross the pedestrian bridge
        {lat: 52.37360, lng: 4.91054}, // Along Oosterdokskade
        {lat: 52.37322, lng: 4.90950}, // Oosterdokskade curves left
        {lat: 52.37264, lng: 4.90902}, // Becoming Oudeschans
        {lat: 52.37200, lng: 4.90885}, // Along the canal southward
        {lat: 52.37139, lng: 4.90870}  // Arrive at Montelbaanstoren
      ]
    },
    {
      // Step 2: Montelbaanstoren to Nieuwmarkt & In de Waag
      fromStopId: 2,
      toStopId: 3,
      coordinates: [
        {lat: 52.37139, lng: 4.90870}, // Start at Montelbaanstoren
        {lat: 52.37152, lng: 4.90820}, // Cross bridge
        {lat: 52.37178, lng: 4.90731}, // Continue west on Oudeschans
        {lat: 52.37222, lng: 4.90550}, // Becomes Sint Antoniesbreestraat
        {lat: 52.37252, lng: 4.90350}, // Walking through shops area
        {lat: 52.37284, lng: 4.90146}  // Arrive at Nieuwmarkt/Waag
      ]
    },
    {
      // Step 3: Nieuwmarkt to Zeedijk/He Hua Temple
      fromStopId: 3,
      toStopId: 4,
      coordinates: [
        {lat: 52.37284, lng: 4.90146}, // Start at Nieuwmarkt
        {lat: 52.37320, lng: 4.90125}, // Exit Nieuwmarkt north
        {lat: 52.37360, lng: 4.90082}, // Along Zeedijk
        {lat: 52.37424, lng: 4.90030}  // Arrive at He Hua Temple
      ]
    },
    {
      // Step 4: Zeedijk to Dam Square
      fromStopId: 4,
      toStopId: 5,
      coordinates: [
        {lat: 52.37424, lng: 4.90030}, // Start at He Hua Temple
        {lat: 52.37390, lng: 4.89950}, // Continue along Zeedijk
        {lat: 52.37382, lng: 4.89860}, // Becomes Geldersekade
        {lat: 52.37369, lng: 4.89732}, // Turn right onto Nieuwendijk
        {lat: 52.37350, lng: 4.89550}, // Walking northwest
        {lat: 52.37317, lng: 4.89361}  // Arrive at Dam Square
      ]
    },
    {
      // Step 5: Dam Square to Begijnhof
      fromStopId: 5,
      toStopId: 6,
      coordinates: [
        {lat: 52.37317, lng: 4.89361}, // Start at Dam Square
        {lat: 52.37250, lng: 4.89280}, // Exit via Kalverstraat
        {lat: 52.37150, lng: 4.89140}, // Continue along Kalverstraat
        {lat: 52.37050, lng: 4.89050}, // Approaching Spui Square
        {lat: 52.36970, lng: 4.89010}, // At Spui
        {lat: 52.36910, lng: 4.88990}, // Enter Begijnhof passage
        {lat: 52.36840, lng: 4.88986}  // Arrive at Begijnhof courtyard
      ]
    },
    {
      // Step 6: Begijnhof to Nine Streets/Canal Belt
      fromStopId: 6,
      toStopId: 7,
      coordinates: [
        {lat: 52.36840, lng: 4.88986}, // Start at Begijnhof
        {lat: 52.36845, lng: 4.88920}, // Exit to Gedempte Begijnensloot
        {lat: 52.36850, lng: 4.88850}, // West to Spui
        {lat: 52.36860, lng: 4.88780}, // Cross Spui
        {lat: 52.36865, lng: 4.88750}, // West to Singel Canal
        {lat: 52.36870, lng: 4.88720}, // Turn right on Singel
        {lat: 52.36880, lng: 4.88690}, // Walking north
        {lat: 52.36885, lng: 4.88670}, // Turn left onto Heisteeg
        {lat: 52.36880, lng: 4.88630}, // Through Nine Streets
        {lat: 52.36878, lng: 4.88580}, // Crossing Herengracht
        {lat: 52.36879, lng: 4.88540}, // Crossing Keizersgracht
        {lat: 52.36880, lng: 4.88496}  // Arrive at Prinsengracht bridge
      ]
    },
    {
      // Step 7: Nine Streets to Westerkerk & Anne Frank House
      fromStopId: 7,
      toStopId: 8,
      coordinates: [
        {lat: 52.36880, lng: 4.88496}, // Start at Reestraat bridge
        {lat: 52.36950, lng: 4.88460}, // Turn right along Prinsengracht
        {lat: 52.37050, lng: 4.88430}, // Walking north
        {lat: 52.37170, lng: 4.88400}, // Continue north
        {lat: 52.37350, lng: 4.88370}, // Approaching Anne Frank House
        {lat: 52.37522, lng: 4.88357}, // Arrive at Anne Frank House
        {lat: 52.37557, lng: 4.88390}  // Final stop at Westerkerk
      ]
    }
  ];

  // Check if tour data already exists
  const existingTourStops = await storage.getTourStops();
  if (existingTourStops.length === 0) {
    // Populate the storage with initial tour stops
    for (const stop of tourStops) {
      await storage.createTourStop(stop);
    }
  }

  // Check if route data already exists
  const existingRoutePaths = await storage.getRoutePaths();
  if (existingRoutePaths.length === 0) {
    // Populate the storage with initial route paths
    for (const path of routePaths) {
      await storage.createRoutePath(path);
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize the tour data
  await initializeTourData();

  // API route to get all tour stops
  app.get("/api/tour-stops", async (req, res) => {
    try {
      const tourStops = await storage.getTourStops();
      res.json(tourStops);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tour stops" });
    }
  });

  // API route to get tour stop by ID
  app.get("/api/tour-stops/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
      const tourStop = await storage.getTourStop(id);
      if (!tourStop) {
        return res.status(404).json({ message: "Tour stop not found" });
      }
      res.json(tourStop);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tour stop" });
    }
  });

  // API route to get route paths for the tour
  app.get("/api/route-paths", async (req, res) => {
    try {
      const routePaths = await storage.getRoutePaths();
      res.json(routePaths);
    } catch (error) {
      res.status(500).json({ message: "Error fetching route paths" });
    }
  });

  // Tour images - serving JPG files from public/images directory
  app.get("/api/images/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const basename = imageName.split('.')[0];
    const locationNames = [
      'nemo', 'montelbaanstoren', 'nieuwmarkt', 'waag', 
      'zeedijk', 'hehua', 'damsquare', 'royalpalace', 
      'begijnhof', 'canals', '9streets', 'westerkerk', 
      'annefrank', 'jordaan'
    ];
    
    // Try to find the JPG file
    const jpgFilename = `${basename}.jpg`;
    const jpgPath = path.join(process.cwd(), 'public', 'images', jpgFilename);
    
    // Try to serve the JPG file if it exists
    if (fs.existsSync(jpgPath)) {
      try {
        res.setHeader('Content-Type', 'image/jpeg');
        return res.sendFile(jpgPath);
      } catch (error) {
        console.error(`Error serving JPG file ${jpgPath}:`, error);
      }
    }
    
    // Fallback to a placeholder if the JPG doesn't exist
    const locationPrefix = locationNames.find(loc => imageName.startsWith(loc)) || 'amsterdam';
    const width = 600;
    const height = 400;
    
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#E5E5E5"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" fill="#333333">
        ${locationPrefix.toUpperCase()} Tour Image
      </text>
      <text x="50%" y="60%" font-family="Arial" font-size="16" text-anchor="middle" fill="#666666">
        Image not found for: ${imageName}
      </text>
    </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  });
  
  // API route to serve audio files from the public/audio directory
  app.get("/api/audio/:audioFileName", (req, res) => {
    const audioFileName = req.params.audioFileName;
    const audioPath = path.join(process.cwd(), 'public', 'audio', audioFileName);
    
    // Check if the audio file exists
    if (fs.existsSync(audioPath)) {
      res.sendFile(audioPath);
    } else {
      // Fallback for audio files that haven't been generated yet
      const stopNumber = audioFileName.replace(/[^0-9]/g, '');
      
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json({
        message: `Audio file for stop ${stopNumber} not found. Run the audio generation script to create it.`,
        audioUrl: req.originalUrl
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
