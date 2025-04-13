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
      description: "We begin at NEMO Science Museum, the large green building shaped like a ship's hull rising from the water. This striking structure was designed by famed architect Renzo Piano and opened in 1997. Renzo Piano wanted NEMO to evoke Amsterdam's seafaring history – indeed, it looks like a giant ship emerging from the harbor! Standing here, you might imagine you're on the bow of a boat about to sail. NEMO is actually built atop a tunnel that runs under the water, and its roof doubles as a public square with cascading steps. Inside NEMO are five floors of hands-on science exhibits (the largest science center in the Netherlands), where kids and adults can experiment and play. From the rooftop terrace, you get a panoramic view of Amsterdam's old city center.",
      kidsContent: "Inside NEMO are five floors of hands-on science exhibits, where kids and adults can experiment and play. You can blow giant bubbles and learn about water, electricity, and light through fun activities! Fun fact: The roof of NEMO is actually a public square where you can see a great view of Amsterdam!",
      orderNumber: 1,
      latitude: 52.374,
      longitude: 4.9126,
      audioUrl: "/api/audio/stop1.mp3", // This would be a placeholder for actual audio file
      duration: "10 minutes",
      nextStopWalkingTime: "5-7 minutes",
      walkingTip: "From NEMO, walk west along the pedestrian bridge and follow the waterfront path towards the small canal. Keep the water on your right. Montelbaanstoren – the old brick tower with a white steeple – will be straight ahead on the canal bank.",
      images: ["/api/images/nemo1.jpg", "/api/images/nemo2.jpg"]
    },
    {
      title: "Montelbaanstoren",
      subtitle: "Medieval Tower - The old brick tower with a white steeple",
      description: "Here we are at Montelbaanstoren, a picturesque 16th-century tower on the canal Oudeschans. This brick tower was originally built around 1512–1516 as part of Amsterdam's medieval city wall. Imagine back then: city guards stood watch here, scanning for enemy ships on the waterways. As you look up, notice the upper section is a different color – the elegant cream-colored clock tower was added later, in 1606. Montelbaanstoren has a fun nickname: 'Malle Jaap,' meaning 'Silly Jack' in Dutch. Why silly? Well, when the new clock and bells were installed, they had a mind of their own – the bells would often chime at odd hours or not at all, confusing everyone! This spot was also a gathering point for sailors in the 1600s. Today, Montelbaanstoren stands peacefully by houseboats and bikes, a reminder of Amsterdam's maritime past.",
      kidsContent: "Montelbaanstoren has a fun nickname: 'Malle Jaap,' meaning 'Silly Jack' in Dutch. Why silly? Well, when the new clock and bells were installed, they had a mind of their own – the bells would often chime at odd hours or not at all, confusing everyone!",
      orderNumber: 2,
      latitude: 52.3725,
      longitude: 4.9065,
      audioUrl: "/api/audio/stop2.mp3",
      duration: "5 minutes",
      nextStopWalkingTime: "5-7 minutes",
      walkingTip: "Cross the bridge next to Montelbaanstoren and continue west down the street Sint Antoniesbreestraat. You'll pass through a short street with shops and then arrive at an open square with a castle-like building in the middle – that's Nieuwmarkt and the Waag.",
      images: ["/api/images/montelbaanstoren1.jpg", "/api/images/montelbaanstoren2.jpg"]
    },
    {
      title: "Nieuwmarkt & Lunch at In de Waag",
      subtitle: "Historic Market Square - The medieval Waag building",
      description: "Welcome to Nieuwmarkt, a lively square that has been a center of commerce for centuries. In Dutch, Nieuwmarkt means 'New Market,' and indeed markets have been held here since the 17th century when this area became a public square. The star of Nieuwmarkt is the Waag, the dramatic medieval building in the center that looks like a little castle with pointed towers. Believe it or not, this is one of Amsterdam's oldest buildings – built in 1488 as a city gate known as St. Anthony's Gate. Back then, Amsterdam's city wall ran right here, and this gate allowed entry into the city. When the city expanded, the walls came down, and by 1614 the moat around the gate was filled to create this market square. The old gate was repurposed as a weigh house, or 'Waag,' where merchants would weigh and trade goods like grain and butter. Today the Waag hosts a café/restaurant called In de Waag – and it's our lunch stop. Fun fact: The Waag is the oldest non-religious building in Amsterdam!",
      kidsContent: "This old building used to be a city gate where people entered Amsterdam. Later it became a place where they weighed goods like cheese and butter to make sure no one was cheating! Different groups of workers like blacksmiths and masons each had their own special room in the building.",
      orderNumber: 3,
      latitude: 52.3725,
      longitude: 4.9003,
      audioUrl: "/api/audio/stop3.mp3",
      duration: "45 minutes (including lunch)",
      nextStopWalkingTime: "5 minutes",
      walkingTip: "From the Waag, walk north across the square and take the street Zeedijk heading towards a large Chinese-style gateway in the distance. You'll notice Chinese shops and restaurants as we enter Chinatown.",
      images: ["/api/images/nieuwmarkt1.jpg", "/api/images/waag1.jpg"]
    },
    {
      title: "Zeedijk and Fo Guang Shan He Hua Temple",
      subtitle: "Chinatown - The largest Buddhist temple in Europe",
      description: "As we walk along Zeedijk, you might feel like we've traveled to a different country! Welcome to Amsterdam's small but vibrant Chinatown. The street name Zeedijk means 'Sea Dike' – centuries ago, this street was a dike holding back the waters of the IJ bay. Sailors from all over the world came ashore here, and in the 20th century Chinese sailors and merchants settled in this area, creating Chinatown. Right in front of us is the Fo Guang Shan He Hua Temple, the largest Buddhist temple in Europe built in traditional Chinese style. Its architecture is hard to miss: a grand entry with tiled green-and-gold roof, carved dragons, and a bright red façade. This beautiful temple was inaugurated in 2000 – even Queen Beatrix of the Netherlands came to open it officially. Take a moment to admire the intricate details on the temple's exterior.",
      kidsContent: "Look at the special temple with its colorful roof and dragons! This is a Buddhist temple where people come to pray and be peaceful. There are two stone lions at the entrance to protect the temple. Can you find any animals or mythical creatures carved on the roof? Dragons and phoenixes are common in Chinese temples – see if you can spot them!",
      orderNumber: 4,
      latitude: 52.3739,
      longitude: 4.9012,
      audioUrl: "/api/audio/stop4.mp3",
      duration: "10 minutes",
      nextStopWalkingTime: "10 minutes",
      walkingTip: "Continue along Zeedijk which will curve and lead you out of Chinatown. Follow street signs towards 'Dam' or 'Dam Square,' heading southwest. You might pass through a short pedestrian shopping street. Keep an eye out for when the streets open up to a large plaza – that's Dam Square.",
      images: ["/api/images/zeedijk1.jpg", "/api/images/hehua1.jpg"]
    },
    {
      title: "Dam Square",
      subtitle: "City Center & Royal Palace - The heart of Amsterdam",
      description: "Welcome to Dam Square, the very heart of Amsterdam. This sprawling plaza is often bustling with life – you'll likely see street performers, pigeons fluttering about, locals on bikes cutting across, and tourists snapping photos. Take a 360° look: on one side stands the grand Royal Palace with its classical facade and green-domed tower, and next to it the Gothic windows of the Nieuwe Kerk (New Church). In the middle of the square is a tall white stone pillar – that's the National Monument, honoring the victims of World War II. It's called Dam Square because this is literally where Amsterdam began – as a dam on the Amstel River in the 13th century. The city's name, Amsteldam, comes from 'dam on the Amstel.' Standing here, you're on what was once a simple dam holding back river water.",
      kidsContent: "This big square is where Amsterdam started! It used to be a real dam that stopped the water from flooding the city. Now it's where people hang out and meet. Can you find the big white pillar monument? It's a special place to remember brave people from a long time ago. Look at the fancy building – that's where the king of the Netherlands sometimes works!",
      orderNumber: 5,
      latitude: 52.3731,
      longitude: 4.8936,
      audioUrl: "/api/audio/stop5.mp3",
      duration: "15 minutes",
      nextStopWalkingTime: "10 minutes",
      walkingTip: "From Dam Square, head southwest along Kalverstraat, one of Amsterdam's main shopping streets. Continue until you see a small arched gateway on your right – that's the entrance to Begijnhof. It's easy to miss, so watch for a simple arch with 'Begijnhof' written above it.",
      images: ["/api/images/damsquare1.jpg", "/api/images/royalpalace1.jpg"]
    },
    {
      title: "Begijnhof",
      subtitle: "Secret Courtyard of the Beguines - A hidden medieval sanctuary",
      description: "We've now entered one of Amsterdam's best-kept secrets: the Begijnhof (pronounced roughly like 'buh-HINE-hof'). Step through this narrow entrance, and you'll discover a peaceful courtyard surrounded by historic houses – a quiet oasis in the middle of bustling Amsterdam. The Begijnhof dates back to the 14th century and was originally built as a sanctuary for the Beguines, a Catholic sisterhood of women who lived like nuns but didn't take formal vows. These religious women dedicated their lives to educating the poor and caring for the sick. The houses around this courtyard were their homes. Note the architecture – most houses date from the 17th and 18th centuries, though the oldest wooden house in Amsterdam (built around 1465) still stands on the courtyard's west side. It's one of only two wooden facades left in the city center!",
      kidsContent: "We're entering a secret garden hidden in the middle of the city! Long ago, a group of special women called Beguines lived here. They weren't nuns, but they were religious and helped take care of sick people. Can you spot the oldest wooden house in Amsterdam? It's over 550 years old! Look at how the houses face inward to this peaceful garden, like they're hiding from the busy city.",
      orderNumber: 6,
      latitude: 52.3695,
      longitude: 4.8892,
      audioUrl: "/api/audio/stop6.mp3",
      duration: "15 minutes",
      nextStopWalkingTime: "15 minutes",
      walkingTip: "Exit Begijnhof the same way you entered and head west. Cross the Singel canal and continue straight until you reach the next set of canals – Herengracht, Keizersgracht, and Prinsengracht. You're now entering the Canal Belt and the Nine Streets area.",
      images: ["/api/images/begijnhof1.jpg", "/api/images/begijnhof2.jpg"]
    },
    {
      title: "The Canal Belt & The Nine Streets",
      subtitle: "Grachtengordel - The iconic canal system and boutique shopping area",
      description: "We've arrived at the Canal Belt, or 'Grachtengordel' in Dutch – the iconic ring of canals that defines Amsterdam's historic center. These three main canals – Herengracht, Keizersgracht, and Prinsengracht – were dug in the 17th century during Amsterdam's Golden Age, creating the city's distinctive half-moon shape. The Canal Belt is a UNESCO World Heritage site, praised for its unique urban planning and beautiful architecture. As we walk through the area, notice the tall, narrow canal houses. Their distinctive facades – often crowned with elaborate gables – were built by wealthy merchants during the Golden Age. Most houses are just 25-30 feet wide due to tax laws that charged homeowners based on canal frontage! We're also in an area called 'The Nine Streets' (De Negen Straatjes) – a charming shopping district where nine narrow streets cross the canals, creating a grid of boutiques, vintage stores, specialty shops, and cozy cafes.",
      kidsContent: "Look at all these pretty canals and fancy houses! These canals were dug over 400 years ago to help ships bring goods into the city. The houses are tall and skinny because people had to pay taxes based on how wide their house was along the canal. The skinnier the house, the less tax they paid! These nine small streets are named after crafts that people used to do here long ago, like making gloves or barrels. Now they're full of cool shops where you can find things you won't see anywhere else!",
      orderNumber: 7,
      latitude: 52.3693,
      longitude: 4.8856,
      audioUrl: "/api/audio/stop7.mp3",
      duration: "30 minutes",
      nextStopWalkingTime: "10 minutes",
      walkingTip: "From the Nine Streets area, continue west until you reach the Prinsengracht canal. Follow it north until you see a tall church tower with a blue crown (the Westerkerk). Nearby, you'll find the Anne Frank House on Prinsengracht. Continue a bit further into the Jordaan district.",
      images: ["/api/images/canals1.jpg", "/api/images/9streets1.jpg"]
    },
    {
      title: "Jordaan District – Westerkerk and Anne Frank House",
      subtitle: "Charming neighborhood - The artistic heart of Amsterdam",
      description: "Welcome to the Jordaan, our final stop and one of Amsterdam's most beloved neighborhoods. Originally built in the 17th century as a working-class area, the Jordaan has transformed into a charming, upscale district known for its narrow streets, small canals, historic buildings, and artistic atmosphere. As we explore, we'll see the magnificent Westerkerk (Western Church) with its 85-meter tower – the tallest church tower in Amsterdam with its distinctive blue imperial crown. Nearby stands the Anne Frank House, where Anne Frank and her family hid from Nazi persecution during World War II for more than two years. This unassuming building on the Prinsengracht canal is now a museum preserving the secret annex where Anne wrote her famous diary. Throughout the Jordaan, you'll notice many small inner courtyards called 'hofjes' – hidden residential gardens providing peaceful retreats amidst the urban setting. The district is also known for its great restaurants, art galleries, and authentic brown cafés (traditional Dutch pubs).",
      kidsContent: "We're in the Jordaan – once a neighborhood where workers and immigrants lived, now full of art, music, and delicious food! See that tall church tower with the blue crown? That's the Westerkerk, and it plays beautiful bell music. Nearby is the Anne Frank House, where a girl about your age had to hide during wartime and wrote a famous diary. The Jordaan has lots of secret gardens called 'hofjes' hidden between buildings. People play special Dutch folk music here called 'levenslied' during street festivals. It's like a treasure hunt to find all the cool spots!",
      orderNumber: 8,
      latitude: 52.3745,
      longitude: 4.8825,
      audioUrl: "/api/audio/stop8.mp3",
      duration: "End of tour - explore as long as you wish",
      nextStopWalkingTime: "",
      walkingTip: "Take your time exploring the winding streets, browsing the art galleries, or enjoying a snack at one of the many cafes. The Jordaan is perfect for leisurely wandering.",
      images: ["/api/images/westerkerk1.jpg", "/api/images/jordaan1.jpg", "/api/images/annefrank1.jpg"]
    }
  ];

  // Simple route path between stops (in real app, would be more detailed coordinates)
  const routePaths = [
    {
      fromStopId: 1,
      toStopId: 2,
      coordinates: [
        {lat: 52.374, lng: 4.9126},
        {lat: 52.3735, lng: 4.9105},
        {lat: 52.3725, lng: 4.9065}
      ]
    },
    {
      fromStopId: 2,
      toStopId: 3,
      coordinates: [
        {lat: 52.3725, lng: 4.9065},
        {lat: 52.3728, lng: 4.9040},
        {lat: 52.3725, lng: 4.9003}
      ]
    },
    {
      fromStopId: 3,
      toStopId: 4,
      coordinates: [
        {lat: 52.3725, lng: 4.9003},
        {lat: 52.3732, lng: 4.9008},
        {lat: 52.3739, lng: 4.9012}
      ]
    },
    {
      fromStopId: 4,
      toStopId: 5,
      coordinates: [
        {lat: 52.3739, lng: 4.9012},
        {lat: 52.3735, lng: 4.8974},
        {lat: 52.3731, lng: 4.8936}
      ]
    },
    {
      fromStopId: 5,
      toStopId: 6,
      coordinates: [
        {lat: 52.3731, lng: 4.8936},
        {lat: 52.3715, lng: 4.8914},
        {lat: 52.3695, lng: 4.8892}
      ]
    },
    {
      fromStopId: 6,
      toStopId: 7,
      coordinates: [
        {lat: 52.3695, lng: 4.8892},
        {lat: 52.3694, lng: 4.8874},
        {lat: 52.3693, lng: 4.8856}
      ]
    },
    {
      fromStopId: 7,
      toStopId: 8,
      coordinates: [
        {lat: 52.3693, lng: 4.8856},
        {lat: 52.3719, lng: 4.8840},
        {lat: 52.3745, lng: 4.8825}
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

  // Tour images - using SVG files from public/images directory
  app.get("/api/images/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const locationNames = [
      'nemo', 'montelbaanstoren', 'nieuwmarkt', 'waag', 
      'zeedijk', 'hehua', 'damsquare', 'royalpalace', 
      'begijnhof', 'canals', '9streets', 'westerkerk', 
      'annefrank', 'jordaan'
    ];
    
    // Check if we have a real image for this location
    const svgFilename = `${imageName.split('.')[0]}.svg`;
    const svgPath = path.join(process.cwd(), 'public', 'images', svgFilename);
    
    // Try to serve the SVG file if it exists
    if (fs.existsSync(svgPath)) {
      try {
        const svgContent = fs.readFileSync(svgPath, 'utf8');
        res.setHeader('Content-Type', 'image/svg+xml');
        return res.send(svgContent);
      } catch (error) {
        console.error(`Error reading SVG file ${svgPath}:`, error);
      }
    }
    
    // Fallback to placeholder if the SVG file doesn't exist
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
        (Placeholder for ${imageName})
      </text>
    </svg>
    `;
    
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  });
  
  // Placeholder for audio files
  app.get("/api/audio/:audioName", (req, res) => {
    const audioName = req.params.audioName;
    const stopNumber = audioName.replace(/[^0-9]/g, '');
    
    res.setHeader('Content-Type', 'application/json');
    res.json({
      message: `Audio placeholder for stop ${stopNumber}. In a real application, this would serve an actual audio file.`,
      audioUrl: req.originalUrl
    });
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
