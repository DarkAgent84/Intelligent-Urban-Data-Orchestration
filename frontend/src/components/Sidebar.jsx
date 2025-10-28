import React from 'react';
import { RefreshCw, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Card } from './ui/card';

const eventConfig = {
  traffic: { label: 'Traffic', color: '#ef4444', icon: '🚦' },
  construction: { label: 'Construction', color: '#f97316', icon: '🚧' },
  accident: { label: 'Accident', color: '#a855f7', icon: '🚑' },
  flood: { label: 'Flood', color: '#3b82f6', icon: '🌊' }
};

const Sidebar = ({ filters, onFilterChange, onRefresh, events, lastUpdate, isRefreshing }) => {
  const calculateStats = () => {
    const stats = {};
    Object.keys(eventConfig).forEach(type => {
      const typeEvents = events.filter(e => e.type === type);
      stats[type] = {
        count: typeEvents.length,
        avgConfidence: typeEvents.length > 0 
          ? (typeEvents.reduce((sum, e) => sum + e.confidence, 0) / typeEvents.length).toFixed(2)
          : '0.00'
      };
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
        <p className="text-sm text-gray-500 mt-2">Real-time Event Monitor</p>
      </div>

      {/* Filters Section */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
            Event Filters
          </h3>
          <div className="space-y-3">
            {Object.entries(eventConfig).map(([type, config]) => (
              <div
                key={type}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  id={type}
                  checked={filters[type]}
                  onCheckedChange={(checked) => onFilterChange(type, checked)}
                  className="border-2"
                />
                <label
                  htmlFor={type}
                  className="flex items-center gap-2 cursor-pointer flex-1 text-sm font-medium text-gray-700"
                >
                  <span className="text-xl">{config.icon}</span>
                  <span>{config.label}</span>
                  <div
                    className="w-3 h-3 rounded-full ml-auto"
                    style={{ backgroundColor: config.color }}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Events'}
        </Button>
      </div>

      {/* Statistics Section */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
          Statistics
        </h3>
        <Card className="p-4 bg-white border border-gray-200">
          <div className="space-y-3">
            {Object.entries(eventConfig).map(([type, config]) => (
              <div key={type} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-base">{config.icon}</span>
                  <span className="text-gray-700 font-medium">{config.label}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{stats[type].count}</div>
                  <div className="text-xs text-gray-500">Conf: {stats[type].avgConfidence}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
            Last updated: {lastUpdate}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;
export { eventConfig };