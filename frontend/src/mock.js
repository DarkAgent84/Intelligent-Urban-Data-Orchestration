// Event simulation utilities for New Zealand camera monitoring

const eventTypes = ['fire', 'dense_traffic', 'sparse_traffic', 'accident'];

/**
 * Load cameras from JSON file
 */
export const loadCameras = async () => {
  try {
    const response = await fetch('/cameras.json');
    const data = await response.json();
    return data[0].cameras; // Extract cameras array from the structure
  } catch (error) {
    console.error('Error loading cameras:', error);
    return [];
  }
};

/**
 * Randomly assign events to 20-30% of cameras
 */
export const simulateEvents = (cameras) => {
  const percentage = 0.2 + Math.random() * 0.1; // 20-30%
  const eventCount = Math.floor(cameras.length * percentage);
  
  // Shuffle cameras and select random subset
  const shuffled = [...cameras].sort(() => Math.random() - 0.5);
  const selectedCameras = shuffled.slice(0, eventCount);
  
  // Assign random events
  return selectedCameras.map(camera => ({
    ...camera,
    eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
    detectedAt: new Date().toISOString(),
    confidence: Math.random() * 0.3 + 0.7 // 0.7 to 1.0
  }));
};

/**
 * Get the most recent event from the events list
 */
export const getMostRecentEvent = (events) => {
  if (events.length === 0) return null;
  return events.reduce((latest, event) => {
    return new Date(event.detectedAt) > new Date(latest.detectedAt) ? event : latest;
  });
};

/**
 * Calculate statistics for events
 */
export const calculateStats = (events) => {
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