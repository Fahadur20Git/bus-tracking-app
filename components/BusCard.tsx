
import React from 'react';
import { BusRoute } from '../types';
import { TRANSLATIONS } from '../constants';

interface BusCardProps {
  bus: BusRoute;
  language: 'en' | 'ta';
  isSelected: boolean;
  onSelect: () => void;
}

const BusCard: React.FC<BusCardProps> = ({ bus, language, isSelected, onSelect }) => {
  const t = TRANSLATIONS[language];

  return (
    <div 
      onClick={onSelect}
      className={`group bg-white rounded-xl shadow-sm border-2 transition-all cursor-pointer overflow-hidden ${
        isSelected ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-transparent hover:border-emerald-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail for Private Buses or Highlights */}
        <div className="sm:w-32 bg-gray-50 flex flex-col items-center justify-center p-3 border-b sm:border-b-0 sm:border-r border-gray-100 shrink-0">
          <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded-md mb-2 w-full text-center">
            {bus.busNumber}
          </span>
          <div className="text-center">
             <div className="text-[10px] uppercase text-gray-500 font-bold mb-1 tracking-tighter line-clamp-2">{bus.type}</div>
          </div>
          {bus.imageUrl && (
            <img src={bus.imageUrl} className="w-12 h-12 object-cover rounded-full mt-1 hidden sm:block border-2 border-emerald-100" />
          )}
        </div>

        <div className="p-4 flex-1">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-gray-900 leading-tight text-lg">{bus.name}</h3>
            {bus.eta !== undefined && (
              <div className="text-right text-emerald-700">
                <span className="text-2xl font-black">{bus.eta}</span>
                <span className="text-[10px] font-bold ml-1 uppercase">{t.mins}</span>
              </div>
            )}
          </div>

          {/* Timing Visualizer */}
          <div className="grid grid-cols-3 gap-1 mb-4">
            <div className="bg-zinc-50 p-2 rounded-l-lg border-l-4 border-emerald-500 text-center">
              <div className="text-[9px] text-gray-400 font-bold uppercase">Starts</div>
              <div className="text-sm font-bold text-zinc-800">{bus.departureTimeFromStand || bus.firstBus}</div>
              <div className="text-[8px] text-zinc-400 truncate">{bus.source}</div>
            </div>
            
            <div className={`p-2 text-center flex flex-col justify-center relative ${bus.timeAtYourLocation ? 'bg-emerald-50 border-y border-emerald-200' : 'bg-gray-50'}`}>
              <div className="text-[9px] text-emerald-600 font-bold uppercase">Passes You</div>
              <div className="text-sm font-black text-emerald-700">{bus.timeAtYourLocation || '--:--'}</div>
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-100 -z-10"></div>
            </div>

            <div className="bg-zinc-50 p-2 rounded-r-lg border-r-4 border-zinc-300 text-center">
              <div className="text-[9px] text-gray-400 font-bold uppercase">Arrival</div>
              <div className="text-sm font-bold text-zinc-800">{bus.arrivalTimeAtDestination || '--:--'}</div>
              <div className="text-[8px] text-zinc-400 truncate">{bus.destination}</div>
            </div>
          </div>

          {isSelected && (
            <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-600">
              <div className="flex gap-4">
                <span><strong>Frequency:</strong> {bus.frequencyMinutes || 20} min</span>
                <span><strong>Trips:</strong> {bus.tripsPerDay}</span>
              </div>
              <button className="bg-emerald-600 text-white px-3 py-1.5 rounded-md font-bold hover:bg-emerald-700 shadow-sm transition-colors">
                {t.walkToRoute}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusCard;
