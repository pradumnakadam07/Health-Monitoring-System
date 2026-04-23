// Hospital Search Service
// Find nearby hospitals based on user location and health issue

// Emergency numbers by region/country
export const emergencyNumbers = {
  US: '911',
  UK: '999',
  India: '102',
  Australia: '000',
  Canada: '911',
  default: '911'
};

// Get emergency number based on country code
export const getEmergencyNumber = (countryCode = 'default') => {
  return emergencyNumbers[countryCode.toUpperCase()] || emergencyNumbers.default;
};

// Get user's current location
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported, using default location');
      resolve({ lat: 40.7128, lng: -74.0060 });
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        const defaultLocations = [
          { lat: 40.7128, lng: -74.0060 },  // New York
          { lat: 28.6139, lng: 77.2090 },   // New Delhi
          { lat: 19.0760, lng: 72.8777 }    // Mumbai
        ];
        const random = defaultLocations[Math.floor(Math.random() * defaultLocations.length)];
        resolve(random);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000  // Cache for 5 minutes
      }
    );
  });
};

// Watch user's location continuously
export const watchUserLocation = (callback, errorCallback) => {
  if (!navigator.geolocation) {
    console.warn('Geolocation not supported');
    callback({ lat: 40.7128, lng: -74.0060, accuracy: null });
    return null;
  }
  
  let watchId = null;
  try {
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        console.warn('Watch location error:', error.message);
        errorCallback?.(error);
        getUserLocation().then(loc => callback(loc)).catch(err => console.error(err));
      },
      {
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 300000  // Cache for 5 minutes
      }
    );
  } catch (e) {
    console.error('Watch position failed:', e);
    errorCallback?.(e);
  }
  return watchId;
};

// Stop watching location
export const stopWatchingLocation = (watchId) => {
  if (watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

// Specialist doctors mapping
export const specialistTypes = {
  'heart': { specialty: 'Cardiology', doctorType: 'Cardiologist', keywords: ['heart', 'cardiac', 'chest pain', 'palpitation'] },
  'cardiac': { specialty: 'Cardiology', doctorType: 'Cardiologist', keywords: ['heart', 'cardiac', 'chest pain'] },
  'chest pain': { specialty: 'Cardiology', doctorType: 'Cardiologist', keywords: ['heart', 'cardiac', 'chest pain'] },
  'brain': { specialty: 'Neurology', doctorType: 'Neurologist', keywords: ['brain', 'neuro', 'stroke', 'headache'] },
  'neuro': { specialty: 'Neurology', doctorType: 'Neurologist', keywords: ['brain', 'neuro', 'stroke'] },
  'stroke': { specialty: 'Neurology', doctorType: 'Neurologist', keywords: ['brain', 'neuro', 'stroke'] },
  'bone': { specialty: 'Orthopedics', doctorType: 'Orthopedic Surgeon', keywords: ['bone', 'ortho', 'fracture', 'joint'] },
  'ortho': { specialty: 'Orthopedics', doctorType: 'Orthopedic Surgeon', keywords: ['bone', 'ortho', 'fracture'] },
  'fracture': { specialty: 'Orthopedics', doctorType: 'Orthopedic Surgeon', keywords: ['bone', 'ortho', 'fracture'] },
  'child': { specialty: 'Pediatrics', doctorType: 'Pediatrician', keywords: ['child', 'kids', 'infant'] },
  'kids': { specialty: 'Pediatrics', doctorType: 'Pediatrician', keywords: ['child', 'kids', 'infant'] },
  'pregnancy': { specialty: 'Obstetrics', doctorType: 'Obstetrician', keywords: ['pregnancy', 'pregnant', 'delivery'] },
  'pregnant': { specialty: 'Obstetrics', doctorType: 'Obstetrician', keywords: ['pregnancy', 'pregnant', 'delivery'] },
  'cancer': { specialty: 'Oncology', doctorType: 'Oncologist', keywords: ['cancer', 'tumor', 'malignancy'] },
  'tumor': { specialty: 'Oncology', doctorType: 'Oncologist', keywords: ['cancer', 'tumor'] },
  'eye': { specialty: 'Ophthalmology', doctorType: 'Ophthalmologist', keywords: ['eye', 'vision', 'sight'] },
  'vision': { specialty: 'Ophthalmology', doctorType: 'Ophthalmologist', keywords: ['eye', 'vision'] },
  'skin': { specialty: 'Dermatology', doctorType: 'Dermatologist', keywords: ['skin', 'rash', 'allergy'] },
  'dental': { specialty: 'Dental', doctorType: 'Dentist', keywords: ['dental', 'teeth', 'tooth'] },
  'teeth': { specialty: 'Dental', doctorType: 'Dentist', keywords: ['dental', 'teeth'] },
  'mental': { specialty: 'Psychiatry', doctorType: 'Psychiatrist', keywords: ['mental', 'depression', 'anxiety'] },
  'depression': { specialty: 'Psychiatry', doctorType: 'Psychiatrist', keywords: ['mental', 'depression', 'anxiety'] },
  'anxiety': { specialty: 'Psychiatry', doctorType: 'Psychiatrist', keywords: ['mental', 'depression', 'anxiety'] },
  'diabetes': { specialty: 'Endocrinology', doctorType: 'Endocrinologist', keywords: ['diabetes', 'thyroid', 'hormone'] },
  'kidney': { specialty: 'Nephrology', doctorType: 'Nephrologist', keywords: ['kidney', 'renal'] },
  'lung': { specialty: 'Pulmonology', doctorType: 'Pulmonologist', keywords: ['lung', 'breathing', 'respiratory'] },
  'stomach': { specialty: 'Gastroenterology', doctorType: 'Gastroenterologist', keywords: ['stomach', 'digestive', 'intestinal'] },
  'liver': { specialty: 'Hepatology', doctorType: 'Hepatologist', keywords: ['liver', 'hepatitis'] },
  'ear': { specialty: 'ENT', doctorType: 'ENT Specialist', keywords: ['ear', 'nose', 'throat', 'hearing'] },
  'throat': { specialty: 'ENT', doctorType: 'ENT Specialist', keywords: ['ear', 'nose', 'throat'] }
};

// Get specialist info based on health issue
export const getSpecialistInfo = (healthIssue) => {
  const issue = healthIssue?.toLowerCase() || '';
  return specialistTypes[issue] || null;
};

// Search nearby hospitals using Google Maps Places API
export const searchNearbyHospitals = async (lat, lng, radius = 10000, specialty = null) => {
  // In production, this would use Google Maps Places API
  // For demo purposes, we'll return mock data based on the location
  
  const mockHospitals = [
    {
      name: 'City General Hospital',
      specialty: 'General',
      address: '123 Main Street, Downtown',
      phone: '+1-555-0100',
      distance: '1.2 km',
      lat: lat + 0.01,
      lng: lng + 0.01,
      rating: 4.5,
      openNow: true,
      isEmergency: true,
      specialists: ['Cardiologist', 'Neurologist', 'Orthopedic Surgeon'],
      available24x7: true
    },
    {
      name: 'Medical Center Plus',
      specialty: 'Multi-specialty',
      address: '456 Oak Avenue, Midtown',
      phone: '+1-555-0101',
      distance: '2.5 km',
      lat: lat + 0.02,
      lng: lng - 0.01,
      rating: 4.8,
      openNow: true,
      isEmergency: true,
      specialists: ['Pediatrician', 'Oncologist', 'Dermatologist'],
      available24x7: true
    },
    {
      name: 'Heart Care Center',
      specialty: 'Cardiology',
      address: '789 Pine Road, Uptown',
      phone: '+1-555-0102',
      distance: '3.8 km',
      lat: lat - 0.015,
      lng: lng + 0.02,
      rating: 4.7,
      openNow: false,
      isEmergency: true,
      specialists: ['Cardiologist', 'Cardiac Surgeon'],
      available24x7: false
    },
    {
      name: 'Community Health Center',
      specialty: 'General',
      address: '321 Elm Street, Eastside',
      phone: '+1-555-0103',
      distance: '4.1 km',
      lat: lat + 0.025,
      lng: lng + 0.015,
      rating: 4.3,
      openNow: true,
      isEmergency: true,
      specialists: ['General Physician', 'Dentist'],
      available24x7: true
    },
    {
      name: 'Children\'s Hospital',
      specialty: 'Pediatrics',
      address: '654 Maple Drive, Westside',
      phone: '+1-555-0104',
      distance: '5.3 km',
      lat: lat - 0.02,
      lng: lng - 0.025,
      rating: 4.9,
      openNow: true,
      isEmergency: false,
      specialists: ['Pediatrician', 'Neonatologist'],
      available24x7: true
    },
    {
      name: 'Neuro Sciences Institute',
      specialty: 'Neurology',
      address: '987 Cedar Lane, Northside',
      phone: '+1-555-0105',
      distance: '6.2 km',
      lat: lat + 0.03,
      lng: lng - 0.02,
      rating: 4.6,
      openNow: true,
      isEmergency: true,
      specialists: ['Neurologist', 'Neurosurgeon'],
      available24x7: true
    },
    {
      name: 'Orthopedic & Joint Center',
      specialty: 'Orthopedics',
      address: '147 Birch Avenue, Southside',
      phone: '+1-555-0106',
      distance: '4.5 km',
      lat: lat - 0.01,
      lng: lng + 0.03,
      rating: 4.4,
      openNow: true,
      isEmergency: false,
      specialists: ['Orthopedic Surgeon', 'Sports Medicine'],
      available24x7: false
    }
  ];
  
  // Filter by specialty if provided
  let hospitals = mockHospitals;
  if (specialty) {
    hospitals = hospitals.filter(h => 
      h.specialty.toLowerCase().includes(specialty.toLowerCase()) ||
      h.name.toLowerCase().includes(specialty.toLowerCase()) ||
      h.specialists?.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
    );
  }
  
  // Sort by distance
  hospitals.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  
  return hospitals;
};

// Get hospital recommendation based on health issue
export const getRecommendedHospitals = async (healthIssue, userLocation = null) => {
  let location;
  
  try {
    if (userLocation) {
      location = userLocation;
    } else {
      location = await getUserLocation();
    }
  } catch (error) {
    console.warn('Failed to get location:', error.message);
    // Use default location if geolocation fails
    const defaultLocations = [
      { lat: 40.7128, lng: -74.0060 },  // New York
      { lat: 28.6139, lng: 77.2090 },   // New Delhi
      { lat: 19.0760, lng: 72.8777 }    // Mumbai
    ];
    location = defaultLocations[Math.floor(Math.random() * defaultLocations.length)];
  }
  
  // Map health issues to specialties
  const specialtyMap = {
    'heart': 'Cardiology',
    'cardiac': 'Cardiology',
    'chest pain': 'Cardiology',
    'brain': 'Neurology',
    'neuro': 'Neurology',
    'stroke': 'Neurology',
    'bone': 'Orthopedics',
    'ortho': 'Orthopedics',
    'fracture': 'Orthopedics',
    'child': 'Pediatrics',
    'kids': 'Pediatrics',
    'pregnancy': 'Obstetrics',
    'pregnant': 'Obstetrics',
    'cancer': 'Oncology',
    'tumor': 'Oncology',
    'eye': 'Ophthalmology',
    'vision': 'Ophthalmology',
    'skin': 'Dermatology',
    'dental': 'Dental',
    'teeth': 'Dental',
    'mental': 'Psychiatry',
    'depression': 'Psychiatry',
    'anxiety': 'Psychiatry',
    'diabetes': 'Endocrinology',
    'kidney': 'Nephrology',
    'lung': 'Pulmonology',
    'stomach': 'Gastroenterology',
    'ear': 'ENT',
    'throat': 'ENT'
  };
  
  const specialty = specialtyMap[healthIssue?.toLowerCase()] || null;
  
  return await searchNearbyHospitals(location.lat, location.lng, 15000, specialty);
};

// Get directions URL for embedding in iframe or app
export const getDirectionsUrl = (fromLat, fromLng, toLat, toLng, mode = 'driving') => {
  return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=${mode}`;
};

// Get embed map URL for showing location
export const getEmbedMapUrl = (lat, lng, name) => {
  return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${lat},${lng}&zoom=15`;
};

// Open hospital in Google Maps (external)
export const openInMaps = (lat, lng, name) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
  window.open(url, '_blank');
};

// Get directions in Google Maps app
export const getDirections = (toLat, toLng, hospitalName) => {
  // Try to open in Google Maps app first, fallback to web
  const url = `https://www.google.com/maps/dir/?api=1&destination=${toLat},${toLng}&destination_place_id=${encodeURIComponent(hospitalName)}`;
  window.open(url, '_blank');
};

// Call hospital phone - uses multiple methods for better compatibility
export const callHospital = (phoneNumber) => {
  // Clean the phone number
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
  
  // Method 1: Try using the tel: protocol (works on mobile)
  // This is the most reliable method for actual phone calls
  const telLink = `tel:${cleanNumber}`;
  
  // Create a link element and click it
  const link = document.createElement('a');
  link.href = telLink;
  link.click();
  
  // Also try direct assignment as fallback
  window.location.href = telLink;
};

// Call emergency number - uses multiple methods for better compatibility
export const callEmergency = (phoneNumber) => {
  // Clean the phone number
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
  
  // Use tel: protocol which works on mobile devices
  const telLink = `tel:${cleanNumber}`;
  
  // Create a link element and click it
  const link = document.createElement('a');
  link.href = telLink;
  link.click();
  
  // Also try direct assignment as fallback
  window.location.href = telLink;
};

export default {
  getUserLocation,
  watchUserLocation,
  stopWatchingLocation,
  searchNearbyHospitals,
  getRecommendedHospitals,
  getSpecialistInfo,
  specialistTypes,
  openInMaps,
  getDirections,
  getDirectionsUrl,
  getEmbedMapUrl,
  callHospital,
  callEmergency,
  getEmergencyNumber,
  emergencyNumbers
};
