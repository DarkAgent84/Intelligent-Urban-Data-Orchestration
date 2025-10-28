// Mock data for urban events

const generateRandomEvent = () => {
  const types = ['traffic', 'construction', 'accident', 'flood'];
  const baseCoords = { lat: 19.0760, lon: 72.8777 };
  
  return {
    id: Date.now() + Math.random(),
    lat: baseCoords.lat + (Math.random() - 0.5) * 0.1,
    lon: baseCoords.lon + (Math.random() - 0.5) * 0.1,
    type: types[Math.floor(Math.random() * types.length)],
    confidence: Math.random() * 0.3 + 0.7 // 0.7 to 1.0
  };
};

export const initialEvents = [
  { id: 1, lat: 19.07, lon: 72.88, type: 'traffic', confidence: 0.94 },
  { id: 2, lat: 19.05, lon: 72.90, type: 'construction', confidence: 0.87 },
  { id: 3, lat: 19.08, lon: 72.84, type: 'flood', confidence: 0.75 },
  { id: 4, lat: 19.06, lon: 72.86, type: 'accident', confidence: 0.91 },
  { id: 5, lat: 19.09, lon: 72.89, type: 'traffic', confidence: 0.82 },
  { id: 6, lat: 19.04, lon: 72.87, type: 'construction', confidence: 0.78 },
  { id: 7, lat: 19.075, lon: 72.85, type: 'accident', confidence: 0.88 },
  { id: 8, lat: 19.065, lon: 72.92, type: 'flood', confidence: 0.69 }
];

export const simulateRefresh = (currentEvents) => {
  const newEvents = [...currentEvents];
  
  // Remove 1-2 random events
  const removeCount = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < removeCount && newEvents.length > 3; i++) {
    const randomIndex = Math.floor(Math.random() * newEvents.length);
    newEvents.splice(randomIndex, 1);
  }
  
  // Add 2-3 new events
  const addCount = Math.floor(Math.random() * 2) + 2;
  for (let i = 0; i < addCount; i++) {
    newEvents.push(generateRandomEvent());
  }
  
  return newEvents;
};