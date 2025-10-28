import React from 'react';
import { RefreshCw, Activity, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

const eventConfig = {
  fire: { label: 'Fire', color: '#f97316', emoji: '🔥' },
  dense_traffic: { label: 'Dense Traffic', color: '#eab308', emoji: '🚗' },
  sparse_traffic: { label: 'Sparse Traffic', color: '#22c55e', emoji: '✅' },
  accident: { label: 'Accident', color: '#ef4444', emoji: '🚨' }
};

const Sidebar = ({ events, onRefresh, lastUpdate, isRefreshing, mostRecentEvent }) => {
  const calculateStats = () => {
    const stats = {
      fire: 0,
      dense_traffic: 0,
      sparse_traffic: 0,
      accident: 0
    };
    
    events.forEach(event => {
      if (stats[event.eventType] !== undefined) {
        stats[event.eventType]++;
      }
    });
    
    return stats;
  };

  const stats = calculateStats();

  return (
    <div className="h-screen w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Urban</h1>
            <h2 className="text-xl font-semibold text-blue-600">Orchestration</h2>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">NZ Live Event Monitor</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Refresh Button */}
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mb-6"
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Events'}
        </Button>

        {/* Statistics Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Event Statistics
          </h3>
          <Card className="p-4 bg-white border border-gray-200">
            <div className="space-y-3">
              {Object.entries(eventConfig).map(([type, config]) => (
                <div key={type} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{config.emoji}</span>
                    <span className="text-gray-700 font-medium">{config.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="font-bold text-gray-900 text-lg">{stats[type]}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-700 font-semibold mb-1">
                Total Active Events
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {events.length}
              </div>
            </div>
          </Card>
        </div>

        {/* Most Recent Event */}
        {mostRecentEvent && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
              Most Recent Detection
            </h3>
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-white border border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{eventConfig[mostRecentEvent.eventType].emoji}</span>
                  <div>
                    <div className="font-bold text-gray-900 capitalize">
                      {eventConfig[mostRecentEvent.eventType].label}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(mostRecentEvent.detectedAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900">{mostRecentEvent.name}</div>
                      <div className="text-xs text-gray-600">{mostRecentEvent.region}</div>
                      <div className="text-xs text-gray-500">{mostRecentEvent.direction}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          Last updated: {lastUpdate}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
export { eventConfig };