'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Clock, 
  Star,
  Building2,
  Filter,
  Search,
  X,
  ChevronRight,
  AlertCircle,
  Map,
  List,
  Cross,
  User,
  RefreshCw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  getUserLocation, 
  getRecommendedHospitals, 
  searchNearbyHospitals,
  getDirections, 
  callHospital,
  getEmergencyNumber,
  getSpecialistInfo,
  watchUserLocation,
  stopWatchingLocation
} from '@/services/hospitalService';
import GlassCard from './GlassCard';
import LoadingSkeleton from './LoadingSkeleton';

export default function HospitalSuggestions({ 
  healthIssue = null,
  riskLevel = 'low',
  autoFetch = true,
  radius = 10000
}) {
  const { t } = useTranslation();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(riskLevel === 'critical');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [specialistInfo, setSpecialistInfo] = useState(null);
  const [trackingLocation, setTrackingLocation] = useState(false);
  const [locationWatchId, setLocationWatchId] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (autoFetch) {
      fetchHospitals();
    }
    
    return () => {
      // Cleanup location watcher on unmount
      if (locationWatchId !== null) {
        stopWatchingLocation(locationWatchId);
      }
    };
  }, [healthIssue, autoFetch, radius]);

  // Get specialist info when healthIssue changes
  useEffect(() => {
    if (healthIssue) {
      const info = getSpecialistInfo(healthIssue);
      setSpecialistInfo(info);
    }
  }, [healthIssue]);

  const fetchHospitals = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user location
      let location;
      try {
        location = await getUserLocation();
        setUserLocation(location);
      } catch (locError) {
        // Use default location if geolocation fails
        location = { lat: 19.0760, lng: 72.8777 }; // Mumbai default
        setUserLocation(location);
      }

      // Fetch hospitals
      let results;
      if (healthIssue) {
        results = await getRecommendedHospitals(healthIssue, location);
      } else {
        results = await searchNearbyHospitals(location.lat, location.lng, radius);
      }

      setHospitals(results);
    } catch (err) {
      setError(err.message || 'Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  };

  // Start continuous location tracking
  const startLocationTracking = () => {
    if (trackingLocation) return;
    
    const watchId = watchUserLocation(
      (location) => {
        setUserLocation(location);
      },
      (error) => {
        console.error('Location tracking error:', error);
      }
    );
    
    if (watchId !== null) {
      setLocationWatchId(watchId);
      setTrackingLocation(true);
    }
  };

  // Stop location tracking
  const stopLocationTracking = () => {
    if (locationWatchId !== null) {
      stopWatchingLocation(locationWatchId);
      setLocationWatchId(null);
    }
    setTrackingLocation(false);
  };

  const filteredHospitals = hospitals.filter(hospital => {
    if (showEmergencyOnly && !hospital.isEmergency) return false;
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'open') return hospital.openNow;
    if (selectedFilter === 'emergency') return hospital.isEmergency;
    return true;
  });

  const handleOpenDirections = (hospital) => {
    if (userLocation) {
      getDirections(hospital.lat, hospital.lng, hospital.name);
    } else {
      // If no user location, just open the hospital location
      window.open(`https://www.google.com/maps/search/?api=1&query=${hospital.lat},${hospital.lng}`, '_blank');
    }
  };

  const handleCall = (phone) => {
    callHospital(phone);
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 4.0) return 'text-yellow-500';
    return 'text-orange-500';
  };

  // Generate Google Maps embed URL
  const getMapEmbedUrl = () => {
    if (!userLocation) return '';
    
    // If a hospital is selected, center on it
    if (selectedHospital) {
      return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedHospital.lat},${selectedHospital.lng}&zoom=15`;
    }
    
    // Otherwise, center on user location
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${userLocation.lat},${userLocation.lng}&zoom=14`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton height="100px" variant="rounded" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <GlassCard className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-slate-600 mb-4">{error}</p>
        <button
          onClick={fetchHospitals}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          {t('retry') || 'Retry'}
        </button>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary-500" />
          {t('nearbyHospitals')}
        </h3>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow text-primary-600' : 'text-slate-500'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-white shadow text-primary-600' : 'text-slate-500'}`}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
          
          {/* Location Tracking Toggle */}
          <button
            onClick={trackingLocation ? stopLocationTracking : startLocationTracking}
            className={`p-2 rounded-lg transition-colors ${trackingLocation ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}
            title={trackingLocation ? 'Stop tracking' : 'Track my location'}
          >
            <MapPin className={`w-4 h-4 ${trackingLocation ? 'animate-pulse' : ''}`} />
          </button>
          
          <button
            onClick={fetchHospitals}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Specialist Suggestion Banner */}
      {specialistInfo && (
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Recommended: {specialistInfo.doctorType}
              </p>
              <p className="text-xs text-blue-600">
                Specializing in: {specialistInfo.specialty}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Location Indicator */}
      {userLocation && (
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <MapPin className="w-4 h-4 text-green-500" />
          <span>Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</span>
          {trackingLocation && <span className="text-green-600">(Live tracking)</span>}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedFilter === 'all' 
              ? 'bg-primary-500 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedFilter('open')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedFilter === 'open' 
              ? 'bg-green-500 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Open Now
        </button>
        <button
          onClick={() => setSelectedFilter('emergency')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedFilter === 'emergency' 
              ? 'bg-red-500 text-white' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Emergency
        </button>
        
        {/* Emergency Toggle */}
        {riskLevel === 'critical' && (
          <button
            onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
            className={`ml-auto px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 transition-colors ${
              showEmergencyOnly 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-red-100 text-red-600 hover:bg-red-200'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            Emergency Only
          </button>
        )}
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <div className="relative h-96 rounded-2xl overflow-hidden border border-slate-200">
            {userLocation ? (
              <iframe
                ref={mapRef}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={getMapEmbedUrl()}
                title="Hospital Map"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-slate-100">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-500">Loading map...</p>
                </div>
              </div>
            )}
            
            {/* Map Overlay - Hospital List */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-4 max-h-48 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">
                  {filteredHospitals.length} hospitals found
                </span>
              </div>
              <div className="space-y-2">
                {filteredHospitals.slice(0, 3).map((hospital) => (
                  <div
                    key={hospital.phone}
                    onClick={() => setSelectedHospital(hospital)}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedHospital?.phone === hospital.phone 
                        ? 'bg-primary-100 border border-primary-300' 
                        : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{hospital.name}</p>
                        <p className="text-xs text-slate-500">{hospital.distance} • {hospital.specialty}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCall(hospital.phone);
                          }}
                          className="p-1.5 bg-green-100 text-green-600 rounded-lg"
                        >
                          <Phone className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDirections(hospital);
                          }}
                          className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"
                        >
                          <Navigation className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions for Map View */}
          {selectedHospital && (
            <div className="flex gap-2">
              <button
                onClick={() => handleCall(selectedHospital.phone)}
                className="flex-1 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Call Now
              </button>
              <button
                onClick={() => handleOpenDirections(selectedHospital)}
                className="flex-1 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-5 h-5" />
                Get Directions
              </button>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <AnimatePresence>
          <div className="space-y-3">
            {filteredHospitals.length === 0 ? (
              <GlassCard className="text-center py-8">
                <p className="text-slate-500">{t('noHospitalsFound')}</p>
              </GlassCard>
            ) : (
              filteredHospitals.map((hospital, index) => (
                <motion.div
                  key={hospital.phone}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard 
                    padding="small"
                    className="hover:border-primary-300 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Hospital Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        hospital.isEmergency 
                          ? 'bg-red-100' 
                          : hospital.openNow 
                          ? 'bg-green-100' 
                          : 'bg-slate-100'
                      }`}>
                        {hospital.isEmergency ? (
                          <Cross className="w-6 h-6 text-red-500" />
                        ) : (
                          <Building2 className={`w-6 h-6 ${
                            hospital.openNow 
                              ? 'text-green-500' 
                              : 'text-slate-400'
                          }`} />
                        )}
                      </div>

                      {/* Hospital Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-slate-800 truncate">
                              {hospital.name}
                            </h4>
                            <p className="text-sm text-slate-500 truncate">
                              {hospital.address}
                            </p>
                          </div>
                          
                          {/* Rating */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className={`w-4 h-4 ${getRatingColor(hospital.rating)}`} />
                            <span className={`text-sm font-medium ${getRatingColor(hospital.rating)}`}>
                              {hospital.rating}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full">
                            {hospital.specialty}
                          </span>
                          {hospital.openNow && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                              Open Now
                            </span>
                          )}
                          {hospital.isEmergency && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                              Emergency
                            </span>
                          )}
                          {hospital.available24x7 && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                              24x7
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {hospital.distance}
                          </span>
                        </div>

                        {/* Specialists */}
                        {hospital.specialists && hospital.specialists.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {hospital.specialists.slice(0, 3).map((spec, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                                {spec}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleCall(hospital.phone)}
                            className="flex-1 py-2 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            {t('call')}
                          </button>
                          <button
                            onClick={() => handleOpenDirections(hospital)}
                            className="flex-1 py-2 bg-blue-500 text-white text-sm font-medium rounded-xl hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                          >
                            <Navigation className="w-4 h-4" />
                            {t('directions')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))
            )}
          </div>
        </AnimatePresence>
      )}

      {/* Emergency Number Banner */}
      {riskLevel === 'critical' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold text-red-700">{t('emergencyNumber')}</p>
                <p className="text-sm text-red-600">Available 24/7</p>
              </div>
            </div>
            <button
              onClick={() => callHospital(getEmergencyNumber())}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              {getEmergencyNumber()}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
