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
      description: "Welcome to Nieuwmarkt, a lively square that has been a center of commerce for centuries. In Dutch, Nieuwmarkt means 'New Market,' and indeed markets have been held here since the 17th century when this area became a public square. The star of Nieuwmarkt is the Waag, the dramatic medieval building in the center that looks like a little castle with pointed towers.",
      kidsContent: "This old building used to be a city gate where people entered Amsterdam. Later it became a place where they weighed goods like cheese and butter to make sure no one was cheating! Different groups of workers like blacksmiths and masons each had their own special room in the building.",
      orderNumber: 3,
      latitude: 52.3725,
      longitude: 4.9003,
      audioUrl: "/api/audio/stop3.mp3",
      duration: "45 minutes (including lunch)",
      nextStopWalkingTime: "10 minutes",
      walkingTip: "After lunch, exit Nieuwmarkt on the west side and follow the street Kloveniersburgwal along the canal. This will lead you to the area with hidden courtyards.",
      images: ["/api/images/nieuwmarkt1.jpg", "/api/images/waag1.jpg"]
    },
    {
      title: "Hidden Courtyards (Begijnhof)",
      subtitle: "Secret gardens - Peaceful oases in the busy city",
      description: "We're now visiting one of Amsterdam's best-kept secrets: its hidden courtyards. These peaceful enclosures, often surrounded by historic buildings, offer a quiet escape from the busy streets. The most famous is Begijnhof, which dates back to the 14th century and was originally home to a Catholic sisterhood of women called the Beguines.",
      kidsContent: "Imagine you're entering a secret garden! These courtyards were like little villages within the city where people lived together. They have their own rules - you need to be quiet and respectful. Can you spot the oldest wooden house in Amsterdam? It's one of the few that survived the big fires long ago!",
      orderNumber: 4,
      latitude: 52.3702,
      longitude: 4.8903,
      audioUrl: "/api/audio/stop4.mp3",
      duration: "20 minutes",
      nextStopWalkingTime: "10 minutes",
      walkingTip: "Exit the courtyard and head west toward the Singel canal. Cross over and continue into the neighborhood known as the '9 Streets' (De 9 Straatjes).",
      images: ["/api/images/begijnhof1.jpg", "/api/images/begijnhof2.jpg"]
    },
    {
      title: "The 9 Streets (De 9 Straatjes)",
      subtitle: "Shopping district - Charming streets with unique shops",
      description: "We've arrived at 'De 9 Straatjes' or 'The 9 Streets' - a charming shopping district consisting of nine narrow streets that cross three of Amsterdam's main canals. This area is known for its diverse collection of boutiques, vintage stores, specialty shops, and cozy cafes.",
      kidsContent: "These nine small streets are named after crafts that people used to do here long ago, like making gloves or barrels. Now they're full of interesting shops where you can find things you won't see anywhere else! Look for the special signs above the shops that tell you what used to happen in these buildings.",
      orderNumber: 5,
      latitude: 52.3693,
      longitude: 4.8856,
      audioUrl: "/api/audio/stop5.mp3",
      duration: "30 minutes",
      nextStopWalkingTime: "8 minutes",
      walkingTip: "Continue west across the canal bridges until you reach the Prinsengracht canal. Then head north (right) to find the Anne Frank House.",
      images: ["/api/images/9streets1.jpg", "/api/images/9streets2.jpg"]
    },
    {
      title: "Anne Frank House",
      subtitle: "Historic site - Where Anne Frank and her family hid",
      description: "We've now reached one of Amsterdam's most significant historical sites: the Anne Frank House. This unassuming building on the Prinsengracht canal is where Anne Frank, a young Jewish girl, and her family hid from Nazi persecution during World War II for more than two years.",
      kidsContent: "Anne Frank was a girl about your age who had to hide from people who wanted to harm her family during a war. While hiding, she wrote a diary about her life, thoughts, and feelings. Her diary became one of the most famous books in the world, helping people understand what happened during this difficult time in history.",
      orderNumber: 6,
      latitude: 52.3752,
      longitude: 4.8840,
      audioUrl: "/api/audio/stop6.mp3",
      duration: "15 minutes (exterior only)",
      nextStopWalkingTime: "5 minutes",
      walkingTip: "From the Anne Frank House, continue north along the Prinsengracht canal into the heart of the Jordaan district.",
      images: ["/api/images/annefrank1.jpg", "/api/images/annefrank2.jpg"]
    },
    {
      title: "Jordaan District",
      subtitle: "Charming neighborhood - The artistic heart of Amsterdam",
      description: "Welcome to the Jordaan, our final stop and one of Amsterdam's most beloved neighborhoods. Originally built in the 17th century as a working-class area, the Jordaan has transformed into a charming, upscale district known for its narrow streets, small canals, historic buildings, and artistic atmosphere.",
      kidsContent: "The Jordaan used to be where many working people lived in Amsterdam. Now it's full of cool art, music, and delicious food! People play special Dutch folk music here called 'levenslied' during street festivals. Can you spot the tiny inner courtyards called 'hofjes' hidden between buildings? They're like secret gardens!",
      orderNumber: 7,
      latitude: 52.3739,
      longitude: 4.8809,
      audioUrl: "/api/audio/stop7.mp3",
      duration: "End of tour - explore as long as you wish",
      nextStopWalkingTime: "",
      walkingTip: "Take your time exploring the winding streets, browsing the art galleries, or enjoying a snack at one of the many cafes. The Jordaan is perfect for leisurely wandering.",
      images: ["/api/images/jordaan1.jpg", "/api/images/jordaan2.jpg"]
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
        {lat: 52.3715, lng: 4.8950},
        {lat: 52.3702, lng: 4.8903}
      ]
    },
    {
      fromStopId: 4,
      toStopId: 5,
      coordinates: [
        {lat: 52.3702, lng: 4.8903},
        {lat: 52.3695, lng: 4.8880},
        {lat: 52.3693, lng: 4.8856}
      ]
    },
    {
      fromStopId: 5,
      toStopId: 6,
      coordinates: [
        {lat: 52.3693, lng: 4.8856},
        {lat: 52.3723, lng: 4.8848},
        {lat: 52.3752, lng: 4.8840}
      ]
    },
    {
      fromStopId: 6,
      toStopId: 7,
      coordinates: [
        {lat: 52.3752, lng: 4.8840},
        {lat: 52.3745, lng: 4.8825},
        {lat: 52.3739, lng: 4.8809}
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

  // Placeholder for images
  app.get("/api/images/:imageName", (req, res) => {
    const imageName = req.params.imageName;
    const locationNames = ['nemo', 'montelbaanstoren', 'nieuwmarkt', 'waag', 'begijnhof', '9streets', 'annefrank', 'jordaan'];
    
    // Generate placeholder SVG with location name
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
