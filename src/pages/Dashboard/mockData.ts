export const dashboardMockData = {
  recommendation: {
    status: 'wait', // 'irrigate', 'wait', 'alert'
    title: 'Wait before irrigating',
    reason: 'Soil moisture is currently adequate and rain probability is elevated over the next few hours.',
    factors: [
      { id: 'soil', label: 'Soil Moisture', value: 'Adequate', icon: 'soil' },
      { id: 'rain', label: 'Rain Probability', value: '60% (High)', icon: 'rain' },
      { id: 'borewell', label: 'Borewell Recovery', value: 'In Progress', icon: 'borewell' },
      { id: 'solar', label: 'Solar Availability', value: 'Moderate', icon: 'solar' }
    ]
  },
  alerts: [
    { id: '1', type: 'info', message: 'Rain approaching in ~3 hours.' },
    { id: '2', type: 'warning', message: 'Borewell recovering. Safe pumping limit was reached yesterday.' }
  ],
  status: {
    soil: {
      percentage: 68,
      status: 'Healthy',
      trend: 'down',
      requirement: 'Moderate'
    },
    borewell: {
      status: 'Recovering',
      level: '210 ft',
      recoveryEstimate: '4 hours remaining'
    },
    solar: {
      currentGeneration: '4.2 kW',
      todayGeneration: '18 kWh',
      availability: 'Moderate (Cloud cover)'
    },
    weather: {
      temperature: '28°C',
      rainProbability: '60%',
      rainfall: 'Expected'
    },
    pump: {
      status: 'Off',
      currentPower: '0 kW',
      todayEnergy: '12 kWh'
    }
  },
  schedulePreview: [
    { period: 'Morning (6 AM - 12 PM)', action: 'Wait', reason: 'Adequate Moisture' },
    { period: 'Afternoon (12 PM - 6 PM)', action: 'Rain Expected', reason: 'High Probability' },
    { period: 'Evening (6 PM - 12 AM)', action: 'Borewell Recovery', reason: 'Resting Cycle' }
  ],
  borewellChartData: [
    { time: '06:00', level: 150 },
    { time: '08:00', level: 150 },
    { time: '10:00', level: 180 }, // Pumping starts
    { time: '12:00', level: 220 }, // Pumping continues
    { time: '14:00', level: 250 }, // Safe limit reached, pump stops
    { time: '16:00', level: 230 }, // Recovery begins
    { time: '18:00', level: 210 }, // Current time
    { time: '20:00', level: 180, predicted: true },
    { time: '22:00', level: 160, predicted: true },
    { time: '00:00', level: 150, predicted: true }
  ]
};
