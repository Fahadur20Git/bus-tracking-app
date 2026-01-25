
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

    // Initialize map
    const L = (window as any).L;
    if (!L) return;

    const initialPos = userLocation || [10.7905, 78.7047]; // Default to TN center if null
    mapInstanceRef.current = L.map(mapContainerRef.current).setView(initialPos, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update User Location Marker
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userLocation);
    } else {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `<div class="w-6 h-6 bg-blue-500 border-4 border-white rounded-full shadow-lg ring-4 ring-blue-500/30"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      userMarkerRef.current = L.marker(userLocation, { icon: userIcon }).addTo(mapInstanceRef.current);
      mapInstanceRef.current.panTo(userLocation);
    }
  }, [userLocation]);

  // Update Live Bus Markers
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !mapInstanceRef.current) return;

    // Clear removed buses
    const currentBusIds = new Set(liveBuses.map(b => b.id));
    busMarkersRef.current.forEach((marker, id) => {
      if (!currentBusIds.has(id)) {
        marker.remove();
        busMarkersRef.current.delete(id);
      }
    });

    // Add/Update markers
    liveBuses.forEach(bus => {
      if (busMarkersRef.current.has(bus.id)) {
        busMarkersRef.current.get(bus.id).setLatLng(bus.currentLocation);
      } else {
        const busIcon = L.divIcon({
          className: 'bus-marker',
          html: `
            <div class="relative group cursor-pointer">
              <div class="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center border-2 border-white shadow-xl rotate-[${bus.heading}deg]">
                <span class="text-white text-lg -rotate-[${bus.heading}deg]">🚌</span>
              </div>
              <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const marker = L.marker(bus.currentLocation, { icon: busIcon })
          .addTo(mapInstanceRef.current)
          .on('click', () => onBusSelect(bus.routeId));
        
        busMarkersRef.current.set(bus.id, marker);
      }
    });
  }, [liveBuses, onBusSelect]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
};

export default MapComponent;
