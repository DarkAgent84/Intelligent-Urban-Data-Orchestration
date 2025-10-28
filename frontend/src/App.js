import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import { loadCameras, simulateEvents, getMostRecentEvent } from './mock';
import { toast } from './hooks/use-toast';
import { Toaster } from './components/ui/toaster';
import './App.css';

function App() {
  const [cameras, setCameras] = useState([]);
  const [events, setEvents] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load cameras on mount
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      const loadedCameras = await loadCameras();
      setCameras(loadedCameras);
      
      if (loadedCameras.length > 0) {
        // Simulate initial events
        const initialEvents = simulateEvents(loadedCameras);
        setEvents(initialEvents);
        toast({
          title: "System Initialized",
          description: `Monitoring ${loadedCameras.length} cameras across New Zealand`,
        });
      } else {
        toast({
          title: "No cameras found",
          description: "Please check cameras.json file",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    };
    
    initialize();
  }, []);

  const handleRefresh = () => {
    if (cameras.length === 0) return;
    
    setIsRefreshing(true);
    
    // Simulate network delay
    setTimeout(() => {
      const newEvents = simulateEvents(cameras);
      setEvents(newEvents);
      setLastUpdate(new Date().toLocaleTimeString());
      setIsRefreshing(false);
      
      toast({
        title: "Events Updated",
        description: `${newEvents.length} active events detected`,
      });
    }, 1000);
  };

  const mostRecentEvent = getMostRecentEvent(events);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-700">Loading camera network...</div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          events={events}
          onRefresh={handleRefresh}
          lastUpdate={lastUpdate}
          isRefreshing={isRefreshing}
          mostRecentEvent={mostRecentEvent}
        />
        <MapView events={events} />
      </div>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;