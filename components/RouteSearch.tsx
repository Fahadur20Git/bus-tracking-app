
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { searchBusesOnRoute } from '../services/geminiService';
import BusCard from './BusCard';
import { BusRoute, BusType } from '../types';

const RouteSearch: React.FC<{ language: 'en' | 'ta', currentLocationName?: string }> = ({ language, currentLocationName }) => {
  const [source, setSource] = useState('');
  const [dest, setDest] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const t = TRANSLATIONS[language];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || !dest) return;
    setLoading(true);
    const data = await searchBusesOnRoute(source, dest, currentLocationName);
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{t.search.from}</label>
            <input 
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="e.g. Coimbatore"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{t.search.to}</label>
            <input 
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="e.g. Pollachi"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "🔍"}
            {t.search.btn}
          </button>
        </form>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-bold text-gray-800">{t.search.results}</h3>
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
              {t.search.total}: {results.totalBusesPerDay}
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {results.buses.map((bus: any, idx: number) => {
              const busData: BusRoute = {
                id: `search-${idx}`,
                busNumber: bus.busNumber,
                name: bus.name,
                type: bus.type as BusType,
                source: source,
                destination: dest,
                firstBus: bus.firstBus || bus.departureTime,
                lastBus: bus.lastBus || "N/A",
                tripsPerDay: bus.tripsPerDay,
                path: [],
                stops: [],
                frequencyMinutes: bus.frequencyMinutes,
                departureTimeFromStand: bus.departureTime,
                arrivalTimeAtDestination: bus.arrivalTime,
                timeAtYourLocation: bus.timeAtUserLocation
              };
              return (
                <BusCard 
                  key={idx} 
                  bus={busData} 
                  language={language} 
                  isSelected={true} 
                  onSelect={() => {}} 
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteSearch;
