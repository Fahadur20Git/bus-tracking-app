
export enum BusType {
  MTC = 'MTC (Chennai City)',
  TNSTC = 'TNSTC (State)',
  SETC = 'SETC (Express)',
  PRIVATE = 'Private Bus',
  MINI = 'Mini Bus',
  RURAL = 'Rural Town Bus'
}

export interface BusRoute {
  id: string;
  busNumber: string;
  name: string;
  type: BusType;
  source: string;
  destination: string;
  path: [number, number][]; // Coordinates
  stops: BusStop[];
  firstBus: string;
  lastBus: string;
  tripsPerDay: number;
  imageUrl?: string;
  frequencyMinutes?: number;
  eta?: number;
}

export interface BusStop {
  id: string;
  name: string;
  location: [number, number];
}

export interface LiveBus {
  id: string;
  routeId: string;
  currentLocation: [number, number];
  heading: number;
  lastUpdated: string;
  occupancy: 'Low' | 'Medium' | 'High';
}

export type ViewMode = 'map' | 'search' | 'board';

export interface AppState {
  userLocation: [number, number] | null;
  nearbyBuses: BusRoute[];
  liveBuses: LiveBus[];
  selectedBusId: string | null;
  isLoading: boolean;
  language: 'en' | 'ta';
  error: string | null;
  locationDetails: string;
  viewMode: ViewMode;
}
