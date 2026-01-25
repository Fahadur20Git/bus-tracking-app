
import React from 'react';
import { BusRoute } from '../types';
import { TRANSLATIONS } from '../constants';

interface BusCardProps {
  bus: BusRoute & { eta?: number };
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
      <div className="flex">
        {/* Thumbnail for Private Buses */}
        {bus.type.includes('Private') && bus.imageUrl && (
          <div className="w-24 h-auto shrink-0 relative overflow-hidden hidden sm:block">
            <img 
              src={bus.imageUrl} 
              alt={bus.name} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
            <div className="absolute top-1 left-1 bg-yellow-400 text-[10px] font-bold px-1 rounded shadow">PRIVATE</div>
          </div>
        )}

        <div className="p-4 flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="inline-block bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-1">
                {bus.busNumber}
              </span>
              <h3 className="font-bold text-gray-900 leading-tight">{bus.name}</h3>
              <p className="text-[10px] uppercase text-gray-500 font-semibold tracking-wider">{bus.type}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-emerald-600 font-bold mb-1 flex items-center justify-end gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                {t.live}
              </div>
              <div className="text-emerald-700">
                <span className="text-2xl font-black">{bus.eta}</span>
                <span className="text-xs font-bold ml-1 uppercase">{t.mins}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded">
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-2 h-2 rounded-full border-2 border-gray-400"></div>
              <div className="w-0.5 h-3 bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            </div>
            <div className="truncate">
              <span className="opacity-60">{bus.source}</span>
              <span className="mx-1">→</span>
              <span className="font-semibold text-gray-800">{bus.destination}</span>
            </div>
          </div>

          {isSelected && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
              <div className="text-[10px]">
                <span className="text-gray-500 block">{t.firstLast}</span>
                <span className="font-bold">{bus.firstBus} - {bus.lastBus}</span>
              </div>
              <div className="text-[10px]">
                <span className="text-gray-500 block">{t.trips}</span>
                <span className="font-bold">{bus.tripsPerDay}</span>
              </div>
              <button className="col-span-2 mt-2 bg-emerald-50 text-emerald-700 py-2 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors">
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
