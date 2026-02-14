
import React, { useEffect, useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { getTravelAnalytics } from '../services/geminiService';

interface AnalyticsData {
  govShare: number;
  privShare: number;
  hourlyDemand: number[];
  dailyVolume: string;
  nightTravelFactor: string;
  topDestinations: string[];
}

const TravelAnalytics: React.FC<{ language: 'en' | 'ta', location: string }> = ({ language, location }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const result = await getTravelAnalytics(location || "Tamil Nadu");
      if (result) setData(result);
      setLoading(false);
    };
    fetchAnalytics();
  }, [location]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold">{t.analytics.loading}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-800">{t.analytics.title}</h2>
            <p className="text-sm text-gray-500 font-medium">
              {t.analytics.subtitle} <span className="text-indigo-600 font-bold">{location || "Nearby Localities"}</span>
            </p>
          </div>
          <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-2xl font-black text-xs">
            {data.dailyVolume} DAILY PASSENGERS
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Share Breakdown */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">{t.analytics.govVsPriv}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-emerald-700">{t.analytics.govLabel}</span>
                  <span>{data.govShare}%</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${data.govShare}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-indigo-700">{t.analytics.privLabel}</span>
                  <span>{data.privShare}%</span>
                </div>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${data.privShare}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Crowd Forecast Card */}
          <div className="bg-indigo-900 text-white p-6 rounded-3xl relative overflow-hidden group">
             <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
             <h3 className="text-indigo-200 font-black text-[10px] uppercase mb-4 tracking-tighter">{t.analytics.crowdLevel}</h3>
             <div className="flex items-center gap-4">
               <div className="text-5xl">📊</div>
               <div>
                  <div className="text-3xl font-black text-white">{data.govShare > 60 ? t.analytics.high : t.analytics.med}</div>
                  <p className="text-xs text-indigo-300 font-medium">Based on regional frequency data</p>
               </div>
             </div>
          </div>
        </div>

        {/* Hourly Chart */}
        <div className="mt-12">
          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6">{t.analytics.peakTitle}</h3>
          <div className="flex items-end justify-between h-40 gap-1 md:gap-2">
            {data.hourlyDemand.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group">
                <div 
                  className={`w-full rounded-t-lg transition-all duration-500 hover:brightness-110 cursor-help ${val > 80 ? 'bg-red-500' : val > 50 ? 'bg-indigo-500' : 'bg-emerald-400'}`}
                  style={{ height: `${val}%` }}
                >
                  <div className="hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                    {val}% Load at {idx}:00
                  </div>
                </div>
                <span className="text-[8px] md:text-[10px] text-gray-400 mt-2 font-bold">{idx}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Night Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-zinc-900 text-white p-8 rounded-3xl shadow-2xl relative border-b-8 border-indigo-600">
           <div className="flex items-center gap-6">
             <div className="text-6xl animate-pulse">🌙</div>
             <div>
               <h3 className="text-xl font-black text-indigo-400 mb-1">{t.analytics.nightInsight}</h3>
               <p className="text-zinc-400 text-sm leading-relaxed">{t.analytics.nightDesc}</p>
               <div className="mt-4 flex gap-2">
                 <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-[10px] font-bold border border-indigo-700/50">High Occupancy</span>
                 <span className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full text-[10px] font-bold border border-zinc-700">Long Distance Focus</span>
               </div>
             </div>
           </div>
           <div className="mt-8 pt-8 border-t border-zinc-800 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-indigo-400 font-black text-xl">2.4x</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">SETC Demand</div>
              </div>
              <div className="text-center">
                <div className="text-emerald-400 font-black text-xl">85%</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">Express Load</div>
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-black text-xl">5 AM</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase">Peak Arrival</div>
              </div>
           </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          <h3 className="text-[10px] font-black uppercase text-gray-400 mb-6 tracking-widest">Trending Hubs</h3>
          <ul className="space-y-4">
            {data.topDestinations.map((dest, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-500">{i+1}</span>
                <span className="text-sm font-bold text-gray-700">{dest}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TravelAnalytics;
