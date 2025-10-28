import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import { initialEvents, simulateRefresh } from './mock';
import './App.css';

function App() {
  const [events, setEvents] = useState(initialEvents);
  const [filters, setFilters] = useState({
    traffic: true,
    construction: true,
    accident: true,
    flood: true
  });
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleFilterChange = (type, checked) => {
    setFilters(prev => ({
      ...prev,
      [type]: checked
    }));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      const newEvents = simulateRefresh(events);
      setEvents(newEvents);
      setLastUpdate(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onRefresh={handleRefresh}
          events={events}
          lastUpdate={lastUpdate}
          isRefreshing={isRefreshing}
        />
        <MapView events={events} filters={filters} />
      </div>
    </BrowserRouter>
  );
}

export default App;