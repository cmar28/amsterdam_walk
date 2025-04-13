import { 
  users, type User, type InsertUser, 
  tourStops, type TourStop, type InsertTourStop,
  routePaths, type RoutePath, type InsertRoutePath
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Tour stop operations
  getTourStops(): Promise<TourStop[]>;
  getTourStop(id: number): Promise<TourStop | undefined>;
  createTourStop(tourStop: InsertTourStop): Promise<TourStop>;

  // Route path operations
  getRoutePaths(): Promise<RoutePath[]>;
  getRoutePath(id: number): Promise<RoutePath | undefined>;
  createRoutePath(routePath: InsertRoutePath): Promise<RoutePath>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tourStopsMap: Map<number, TourStop>;
  private routePathsMap: Map<number, RoutePath>;
  private userCurrentId: number;
  private tourStopCurrentId: number;
  private routePathCurrentId: number;

  constructor() {
    this.users = new Map();
    this.tourStopsMap = new Map();
    this.routePathsMap = new Map();
    this.userCurrentId = 1;
    this.tourStopCurrentId = 1;
    this.routePathCurrentId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Tour stop operations
  async getTourStops(): Promise<TourStop[]> {
    return Array.from(this.tourStopsMap.values());
  }

  async getTourStop(id: number): Promise<TourStop | undefined> {
    return this.tourStopsMap.get(id);
  }

  async createTourStop(insertTourStop: InsertTourStop): Promise<TourStop> {
    const id = this.tourStopCurrentId++;
    
    // Create a properly typed images array
    const images: string[] = Array.isArray(insertTourStop.images) 
      ? [...insertTourStop.images] 
      : [];
    
    // Ensure all nullable fields have proper values
    const tourStop: TourStop = { 
      id,
      title: insertTourStop.title,
      subtitle: insertTourStop.subtitle,
      description: insertTourStop.description,
      orderNumber: insertTourStop.orderNumber,
      latitude: insertTourStop.latitude,
      longitude: insertTourStop.longitude,
      kidsContent: insertTourStop.kidsContent || null,
      audioUrl: insertTourStop.audioUrl || null,
      duration: insertTourStop.duration || null,
      nextStopWalkingTime: insertTourStop.nextStopWalkingTime || null,
      walkingTip: insertTourStop.walkingTip || null,
      images: images
    };
    
    this.tourStopsMap.set(id, tourStop);
    return tourStop;
  }

  // Route path operations
  async getRoutePaths(): Promise<RoutePath[]> {
    return Array.from(this.routePathsMap.values());
  }

  async getRoutePath(id: number): Promise<RoutePath | undefined> {
    return this.routePathsMap.get(id);
  }

  async createRoutePath(insertRoutePath: InsertRoutePath): Promise<RoutePath> {
    const id = this.routePathCurrentId++;
    
    // Create a properly typed coordinates array
    const coordinates: {lat: number, lng: number}[] = Array.isArray(insertRoutePath.coordinates) 
      ? [...insertRoutePath.coordinates]
      : [];
    
    // Ensure coordinates is properly typed
    const routePath: RoutePath = { 
      id,
      fromStopId: insertRoutePath.fromStopId,
      toStopId: insertRoutePath.toStopId,
      coordinates: coordinates
    };
    
    this.routePathsMap.set(id, routePath);
    return routePath;
  }
}

export const storage = new MemStorage();
