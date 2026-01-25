
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
              imageUrl: `https://picsum.photos/seed/bus${idx}/400/300`
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
    <div className="flex flex-col h-screen max-h-screen bg-white font-sans">
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
      <nav className="bg-emerald-800 text-white/70 flex text-xs font-bold shrink-0 shadow-lg relative z-40 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setState(prev => ({ ...prev, viewMode: 'map' }))}
          className={`flex-1 py-3 px-4 border-b-4 transition-all whitespace-nowrap ${state.viewMode === 'map' ? 'border-white text-white bg-emerald-700' : 'border-transparent'}`}
        >
          📍 {t.tabs.nearby}
        </button>
        <button 
          onClick={() => setState(prev => ({ ...prev, viewMode: 'search' }))}
          className={`flex-1 py-3 px-4 border-b-4 transition-all whitespace-nowrap ${state.viewMode === 'search' ? 'border-white text-white bg-emerald-700' : 'border-transparent'}`}
        >
          🔍 {t.tabs.search}
        </button>
        <button 
          onClick={() => setState(prev => ({ ...prev, viewMode: 'board' }))}
          className={`flex-1 py-3 px-4 border-b-4 transition-all whitespace-nowrap ${state.viewMode === 'board' ? 'border-white text-white bg-emerald-700' : 'border-transparent'}`}
        >
          📅 {t.tabs.board}
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {state.viewMode === 'map' && (
          <>
            {/* Map View */}
            <div className="flex-1 bg-gray-200 relative min-h-[40vh] md:min-h-0">
              <MapComponent 
                userLocation={state.userLocation} 
                liveBuses={state.liveBuses}
                onBusSelect={(id) => setState(prev => ({ ...prev, selectedBusId: id }))}
              />
              
              {state.locationDetails && (
                <div className="absolute top-4 left-4 right-4 md:right-auto md:w-80 bg-white p-3 rounded-lg shadow-xl z-20 border-l-4 border-emerald-500">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold mb-1">
                    <span className="text-lg">📍</span> {state.locationDetails}
                  </div>
                  <p className="text-[10px] text-gray-500">{t.loadingInfo}</p>
                </div>
              )}
            </div>

            {/* Sidebar / Bottom List */}
            <div className="w-full md:w-96 bg-gray-50 flex flex-col border-l border-gray-200 shadow-2xl z-30 h-1/2 md:h-full">
              <div className="p-4 bg-white border-b sticky top-0 z-10">
                <h2 className="text-sm font-bold text-gray-800 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="p-1 bg-emerald-100 rounded">🚏</span>
                    {t.findBus}
                  </span>
                  <button onClick={getUserLocation} className="text-emerald-600 hover:text-emerald-700 p-1">🔄</button>
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 md:pb-4">
                {state.isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 text-sm font-medium">{t.detecting}</p>
                  </div>
                ) : state.error ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                    <p className="text-sm">{state.error}</p>
                    <button onClick={getUserLocation} className="mt-2 text-xs font-bold underline">Retry</button>
                  </div>
                ) : state.nearbyBuses.length > 0 ? (
                  state.nearbyBuses.map((bus) => (
                    <BusCard 
                      key={bus.id} 
                      bus={bus} 
                      language={state.language} 
                      isSelected={state.selectedBusId === bus.id}
                      onSelect={() => setState(prev => ({ ...prev, selectedBusId: bus.id }))}
                    />
                  ))
                ) : (
                  <div className="text-center py-20 opacity-60">
                    <div className="text-5xl mb-4">🚐</div>
                    <p className="text-sm">{t.noBuses}</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {state.viewMode === 'search' && (
          <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
            <RouteSearch language={state.language} />
          </div>
        )}

        {state.viewMode === 'board' && (
          <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
            <BusStandBoard language={state.language} />
          </div>
        )}
      </main>

      {/* Floating Refresh for Mobile */}
      {state.viewMode === 'map' && (
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <button 
            onClick={getUserLocation}
            className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center text-2xl active:scale-95 transition-transform border-4 border-white"
          >
            🔄
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
