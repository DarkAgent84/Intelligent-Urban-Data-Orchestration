import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { eventConfig } from './Sidebar';

// Create custom colored markers with smooth transitions
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
        transition: all 0.3s ease;
      "></div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const icons = {
  fire: createCustomIcon(eventConfig.fire.color),
  dense_traffic: createCustomIcon(eventConfig.dense_traffic.color),
  sparse_traffic: createCustomIcon(eventConfig.sparse_traffic.color),
  accident: createCustomIcon(eventConfig.accident.color)
};

// Component to handle map updates and centering
const MapUpdater = ({ events }) => {
  const map = useMap();
  
  useEffect(() => {
    if (events.length > 0) {
      const bounds = events.map(e => [e.latitude, e.longitude]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [events, map]);
  
  return null;
};

const MapView = ({ events }) => {
  return (
    <div className="flex-1 h-screen relative">
      <MapContainer
        center={[-36.8485, 174.7633]} // Auckland, New Zealand
        zoom={6}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater events={events} />
        
        {events.map((event) => (
          <Marker
            key={event.key}
            position={[event.latitude, event.longitude]}
            icon={icons[event.eventType]}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{eventConfig[event.eventType].emoji}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 capitalize">
                      {eventConfig[event.eventType].label}
                    </h3>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Camera</div>
                    <div className="font-semibold text-gray-900">{event.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Region</div>
                    <div className="text-gray-800">{event.region}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Direction</div>
                    <div className="text-gray-800">{event.direction}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Description</div>
                    <div className="text-gray-800 text-xs">{event.desc}</div>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Detected:</span>
                      <span className="text-xs font-medium text-gray-700">
                        {new Date(event.detectedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 z-[1000] border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Event Types</h4>
        <div className="space-y-2">
          {Object.entries(eventConfig).map(([type, config]) => (
            <div key={type} className="flex items-center gap-3 text-sm">
              <div
                className="w-5 h-5 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-gray-700 font-medium">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Active Events Counter */}
      <div className="absolute top-6 right-6 bg-white rounded-lg shadow-lg px-4 py-3 z-[1000] border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-gray-700">
            {events.length} Active {events.length === 1 ? 'Event' : 'Events'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapView;