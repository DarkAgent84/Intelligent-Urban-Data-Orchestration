import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { eventConfig } from './Sidebar';

// Create custom colored markers
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
        animation: pulse 2s ease-in-out infinite;
      "></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const icons = {
  traffic: createCustomIcon(eventConfig.traffic.color),
  construction: createCustomIcon(eventConfig.construction.color),
  accident: createCustomIcon(eventConfig.accident.color),
  flood: createCustomIcon(eventConfig.flood.color)
};

// Component to handle map updates
const MapUpdater = ({ events }) => {
  const map = useMap();
  
  useEffect(() => {
    if (events.length > 0) {
      const bounds = events.map(e => [e.lat, e.lon]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [events, map]);
  
  return null;
};

const MapView = ({ events, filters }) => {
  const filteredEvents = events.filter(event => filters[event.type]);
  
  return (
    <div className="flex-1 h-screen relative">
      <MapContainer
        center={[19.0760, 72.8777]}
        zoom={12}
        className="h-full w-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater events={filteredEvents} />
        
        {filteredEvents.map((event) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lon]}
            icon={icons[event.type]}
          >
            <Popup>
              <div className="p-2 min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{eventConfig[event.type].icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 capitalize">
                      {event.type}
                    </h3>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence:</span>
                    <span className="font-semibold text-gray-900">
                      {(event.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Location:</span>
                    <span>{event.lat.toFixed(4)}, {event.lon.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Legend */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 z-[1000] border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Legend</h4>
        <div className="space-y-2">
          {Object.entries(eventConfig).map(([type, config]) => (
            <div key={type} className="flex items-center gap-2 text-sm">
              <div
                className="w-4 h-4 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-gray-700">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Active Events Counter */}
      <div className="absolute top-6 right-6 bg-white rounded-lg shadow-lg px-4 py-3 z-[1000] border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-gray-700">
            {filteredEvents.length} Active Events
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapView;