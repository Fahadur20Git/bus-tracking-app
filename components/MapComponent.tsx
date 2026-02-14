
import React, { useEffect, useRef } from 'react';
import { LiveBus } from '../types';

interface MapComponentProps {
  userLocation: [number, number] | null;
  liveBuses: LiveBus[];
  onBusSelect: (id: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ userLocation, liveBuses, onBusSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const busMarkersRef = useRef<Map<string, any>>(new Map());

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    const initialPos = userLocation || [10.7905, 78.7047];
    mapInstanceRef.current = L.map(mapContainerRef.current, {
      zoomControl: false // Custom controls for better touch UX
    }).setView(initialPos, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(mapInstanceRef.current);

    // Add Zoom Control to Bottom Right
    L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userLocation);
    } else {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div class="w-8 h-8 flex items-center justify-center">
                <div class="absolute w-full h-full bg-blue-500 opacity-20 rounded-full animate-ping"></div>
                <div class="relative w-5 h-5 bg-blue-600 border-4 border-white rounded-full shadow-lg ring-2 ring-blue-500"></div>
              </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      userMarkerRef.current = L.marker(userLocation, { icon: userIcon }).addTo(mapInstanceRef.current);
      mapInstanceRef.current.setView(userLocation, 14);
    }
  }, [userLocation]);

  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    const currentBusIds = new Set(liveBuses.map(b => b.id));
    busMarkersRef.current.forEach((marker, id) => {
      if (!currentBusIds.has(id)) {
        marker.remove();
        busMarkersRef.current.delete(id);
      }
    });

    liveBuses.forEach(bus => {
      if (busMarkersRef.current.has(bus.id)) {
        busMarkersRef.current.get(bus.id).setLatLng(bus.currentLocation);
      } else {
        const busIcon = L.divIcon({
          className: 'bus-marker',
          html: `
            <div class="relative flex flex-col items-center">
              <div class="w-12 h-12 bg-emerald-700 rounded-2xl flex items-center justify-center border-4 border-white shadow-2xl transition-transform hover:scale-110 active:scale-95" style="transform: rotate(${bus.heading}deg)">
                 <span class="text-white text-xl" style="transform: rotate(${-bus.heading}deg)">🚌</span>
              </div>
              <div class="mt-1 bg-white px-2 py-0.5 rounded text-[8px] font-bold shadow-sm border border-emerald-100">Live</div>
            </div>
          `,
          iconSize: [48, 64],
          iconAnchor: [24, 32]
        });

        const marker = L.marker(bus.currentLocation, { icon: busIcon })
          .addTo(mapInstanceRef.current)
          .on('click', () => onBusSelect(bus.routeId));
        
        busMarkersRef.current.set(bus.id, marker);
      }
    });
  }, [liveBuses, onBusSelect]);

  return (
    <div className="w-full h-full relative group">
      <div ref={mapContainerRef} className="w-full h-full" />
      {/* Quick Center Control Overlay */}
      <button 
        onClick={() => userLocation && mapInstanceRef.current?.setView(userLocation, 15)}
        className="absolute top-20 right-4 z-10 bg-white p-3 rounded-xl shadow-xl border border-gray-100 hover:bg-gray-50 active:scale-90 transition-all text-xl"
      >
        🎯
      </button>
    </div>
  );
};

export default MapComponent;
