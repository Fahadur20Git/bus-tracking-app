
import React, { useState } from 'react';
import { TRANSLATIONS } from '../constants';
import { getBusStandTimingBoard } from '../services/geminiService';

const BusStandBoard: React.FC<{ language: 'en' | 'ta' }> = ({ language }) => {
  const [standName, setStandName] = useState('');
  const [loading, setLoading] = useState(false);
  const [boardData, setBoardData] = useState<any>(null);
  const t = TRANSLATIONS[language];

  const handleFetchBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!standName) return;
    setLoading(true);
    try {
      const data = await getBusStandTimingBoard(standName);
      setBoardData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100">
        <form onSubmit={handleFetchBoard} className="flex flex-col md:flex-row gap-4">
          <input 
            value={standName}
            onChange={(e) => setStandName(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder={t.board.placeholder}
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "📊"}
            {t.board.btn}
          </button>
        </form>
      </div>

      {boardData && (
        <div className="bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border-4 border-zinc-800">
          <div className="bg-zinc-800 p-4 flex justify-between items-center border-b border-zinc-700">
            <div>
              <h3 className="text-yellow-500 font-mono text-xl font-bold tracking-widest">{boardData.standName.toUpperCase()}</h3>
              <p className="text-emerald-500 font-mono text-xs">{t.board.departures}</p>
            </div>
            <div className="text-emerald-500 font-mono text-right">
              <div className="text-lg tabular-nums">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="text-[10px] uppercase opacity-50">{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-zinc-800 text-zinc-400 text-[10px] uppercase tracking-tighter">
                <tr>
                  <th className="px-6 py-2">NO.</th>
                  <th className="px-6 py-2">{t.board.destination}</th>
                  <th className="px-6 py-2">{t.board.time}</th>
                  <th className="px-6 py-2">PLAT.</th>
                  <th className="px-6 py-2">{t.board.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {boardData.departures.map((dep: any, idx: number) => (
                  <tr key={idx} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-emerald-500 font-bold">{dep.busNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-orange-500 font-bold uppercase truncate max-w-[150px]">{dep.destination}</div>
                      <div className="text-[10px] text-zinc-500">{dep.type}</div>
                    </td>
                    <td className="px-6 py-4 text-emerald-400 tabular-nums font-bold">
                      {dep.scheduledTime}
                    </td>
                    <td className="px-6 py-4 text-orange-400 font-bold">
                      {dep.platform || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        dep.status.includes('DELAYED') 
                          ? 'bg-red-900/40 text-red-400' 
                          : 'bg-emerald-900/40 text-emerald-400'
                      }`}>
                        {dep.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-zinc-800 p-2 overflow-hidden whitespace-nowrap">
            <div className="inline-block animate-[marquee_20s_linear_infinite] text-orange-500/50 text-[10px] font-mono tracking-widest uppercase">
              +++ PLEASE WEAR MASKS IN CROWDED BUSES +++ CHECK LIVE STATUS FOR ACCURATE TIMINGS +++ TNSTC / SETC HELPLINE: 1800 599 1500 +++
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default BusStandBoard;
