
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BusRoute, AppState, LiveBus, BusType, ViewMode } from './types';
import { TRANSLATIONS } from './constants';
import { detectRoadSegmentAndRoutes } from './services/geminiService';
import BusCard from './components/BusCard';
import LanguageSwitcher from './components/LanguageSwitcher';
import MapComponent from './components/MapComponent';
import RouteSearch from './components/RouteSearch';
import BusStandBoard from './components/BusStandBoard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    userLocation: null,
    nearbyBuses: [],
    liveBuses: [],
    selectedBusId: null,
    isLoading: true,
    language: 'en',
    error: null,
    locationDetails: "",
    viewMode: 'map'
  });

  const setLanguage = (lang: 'en' | 'ta') => {
    setState(prev => ({ ...prev, language: lang }));
  };

  const getUserLocation = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    if (!navigator.geolocation) {
      setState(prev => ({ ...prev, error: "Geolocation not supported", isLoading: false }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setState(prev => ({ ...prev, userLocation: [latitude, longitude] }));
        
        try {
          const aiData = await detectRoadSegmentAndRoutes(latitude, longitude);
          if (aiData) {
            const mappedRoutes: BusRoute[] = aiData.routes.map((r: any, idx: number) => ({
              id: `ai-${idx}`,
              busNumber: r.busNumber,
              name: r.name,
              type: (r.type as BusType) || BusType.TNSTC,
              source: r.source,
              destination: r.destination,
              firstBus: "05:00 AM",
              lastBus: "10:00 PM",
              tripsPerDay: Math.floor(1000 / (r.frequencyMinutes || 30)),
              path: [],
              stops: [],
              eta: r.estimatedArrivalTimeMinutes || Math.floor(Math.random() * 20) + 5,
              imageUrl: `https://picsum.photos/seed/bus${idx}/400/300`,
              timeAtYourLocation: r.timeAtYourLocation
            }));

            const mockLive: LiveBus[] = mappedRoutes.map(r => ({
              id: `live-${r.id}`,
              routeId: r.id,
              currentLocation: [latitude + (Math.random() - 0.5) * 0.02, longitude + (Math.random() - 0.5) * 0.02],
              heading: Math.random() * 360,
              lastUpdated: new Date().toISOString(),
              occupancy: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as any
            }));

            setState(prev => ({ 
              ...prev, 
              nearbyBuses: mappedRoutes, 
              liveBuses: mockLive,
              locationDetails: aiData.locationName,
              isLoading: false 
            }));
          }
        } catch (e) {
          setState(prev => ({ ...prev, isLoading: false, error: "Failed to detect routes" }));
        }
      },
      (err) => {
        setState(prev => ({ ...prev, error: err.message, isLoading: false }));
      }
    );
  }, []);

  useEffect(() => {
    getUserLocation();
  }, []);

  const t = TRANSLATIONS[state.language];

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white font-sans text-sm">
      {/* Header */}
      <header className="bg-emerald-700 text-white p-4 shadow-md flex justify-between items-center z-50 shrink-0">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">🚌</span> {t.title}
          </h1>
          <p className="text-[10px] opacity-80 uppercase tracking-widest">{t.subtitle}</p>
        </div>
        <LanguageSwitcher current={state.language} onToggle={setLanguage} />
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-emerald-800 text-white/70 flex text-[10px] font-black uppercase tracking-tighter shrink-0 shadow-lg relative z-40 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setState(prev => ({ ...prev, viewMode: 'map' }))}
          className={`flex-1 py-4 px-6 border-b-4 transition-all whitespace-nowrap ${state.viewMode === 'map' ? 'border-white text-white bg-emerald-700' : 'border-transparent hover:bg-emerald-700/50'}`}
        >
          📍 {t.tabs.nearby}
        </button>
        <button 
          onClick={() => setState(prev => ({ ...prev, viewMode: 'search' }))}
          className={`flex-1 py-4 px-6 border-b-4 transition-all whitespace-nowrap ${state.viewMode === 'search' ? 'border-white text-white bg