'use client';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { INITIAL_VEHICLES, INITIAL_ALERTS, tickFleet, maybeGenerateAlert, DRIVERS, ROUTES, DEFAULT_CUSTOM_CONFIGS } from './data';

const FleetCtx = createContext(null);

export function FleetProvider({ children }) {
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [selectedId, setSelectedId] = useState(null);
  const [session, setSession] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [customTelemetryConfigs, setCustomTelemetryConfigs] = useState(DEFAULT_CUSTOM_CONFIGS);
  const [drivers, setDrivers] = useState(DRIVERS);

  const vehiclesRef = useRef(vehicles);
  const configsRef = useRef(customTelemetryConfigs);

  // Sync state from localStorage on mount (hydration-safe)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedVehicles = localStorage.getItem('fleet_vehicles');
      const savedDrivers = localStorage.getItem('fleet_drivers');
      const savedAlerts = localStorage.getItem('fleet_alerts');
      const savedConfigs = localStorage.getItem('fleet_configs');
      
      if (savedVehicles) {
        try { setVehicles(JSON.parse(savedVehicles)); } catch(e) {}
      }
      if (savedDrivers) {
        try { setDrivers(JSON.parse(savedDrivers)); } catch(e) {}
      }
      if (savedAlerts) {
        try { setAlerts(JSON.parse(savedAlerts)); } catch(e) {}
      }
      if (savedConfigs) {
        try { setCustomTelemetryConfigs(JSON.parse(savedConfigs)); } catch(e) {}
      }
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      localStorage.setItem('fleet_vehicles', JSON.stringify(vehicles));
    }
  }, [vehicles]);

  useEffect(() => {
    if (drivers && drivers.length > 0) {
      localStorage.setItem('fleet_drivers', JSON.stringify(drivers));
    }
  }, [drivers]);

  useEffect(() => {
    if (alerts && alerts.length > 0) {
      localStorage.setItem('fleet_alerts', JSON.stringify(alerts));
    }
  }, [alerts]);

  useEffect(() => {
    if (customTelemetryConfigs && customTelemetryConfigs.length > 0) {
      localStorage.setItem('fleet_configs', JSON.stringify(customTelemetryConfigs));
    }
  }, [customTelemetryConfigs]);

  useEffect(() => {
    vehiclesRef.current = vehicles;
  }, [vehicles]);

  useEffect(() => {
    configsRef.current = customTelemetryConfigs;
  }, [customTelemetryConfigs]);

  // Live simulation ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setVehicles(prev => tickFleet(prev, configsRef.current));
      const alert = maybeGenerateAlert(vehiclesRef.current);
      if (alert) {
        setAlerts(prev => [alert, ...prev].slice(0, 60));
      }
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const kpis = useMemo(() => {
    const total = vehicles.length;
    const moving = vehicles.filter(v => v.status === 'Moving').length;
    const idle = vehicles.filter(v => v.status === 'Idle').length;
    const offline = vehicles.filter(v => v.gsmSignal < 40).length;
    const online = total - offline;
    const maintenance = vehicles.filter(v => v.distanceUntilService < 800).length;
    const avgSpeed = Math.round(vehicles.reduce((s,v)=>s+v.speed,0)/total);
    const fuelAvg = Math.round(vehicles.reduce((s,v)=>s+v.fuel,0)/total);
    const connectivity = Math.round(vehicles.reduce((s,v)=>s+v.gsmSignal,0)/total);
    const fleetHealth = Math.round(vehicles.reduce((s,v)=>s+v.drivingScore,0)/total);
    const emergencyAlerts = alerts.filter(a => a.severity === 'critical').length;
    const tripsToday = 42 + Math.round(moving * 3.2);
    return { total, moving, idle, offline, online, maintenance, avgSpeed, fuelAvg, connectivity, fleetHealth, emergencyAlerts, tripsToday };
  }, [vehicles, alerts]);

  const login = useCallback((role, id, name) => setSession({ role, driverId: role==='driver'? id : null, name: name || (role==='admin'? 'Admin Console' : id) }), []);
  const logout = useCallback(() => { setSession(null); setActiveView('dashboard'); setSelectedId(null); }, []);

  const addCustomTelemetryConfig = useCallback((config) => {
    setCustomTelemetryConfigs(prev => [...prev, config]);
    setVehicles(prevVehicles => prevVehicles.map(v => {
      const val = Math.round((Math.random() * (config.max - config.min) + config.min) * 10) / 10;
      return {
        ...v,
        customParams: {
          ...v.customParams,
          [config.id]: {
            label: config.label,
            value: val,
            unit: config.unit,
            category: config.category,
            history: Array.from({length: 20}, () => val)
          }
        }
      };
    }));
  }, []);

  const assignRoute = useCallback((vehicleId, routeId) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          routeId: routeId,
          routeProgress: 0,
          currentStopIdx: 0,
          remainingDistance: 50,
          status: 'Moving'
        };
      }
      return v;
    }));
  }, []);

  const assignVehicle = useCallback((vehicleId, driverId) => {
    setVehicles(prev => prev.map(v => {
      let newDriverId = v.driverId;
      if (v.driverId === driverId) {
        newDriverId = null;
      }
      if (v.id === vehicleId) {
        newDriverId = driverId;
      }
      return {
        ...v,
        driverId: newDriverId
      };
    }));
  }, []);

  const addDriver = useCallback((newDriver) => {
    setDrivers(prev => [...prev, newDriver]);
  }, []);

  const addVehicle = useCallback((vData) => {
    const newVeh = {
      id: vData.id,
      plate: vData.plate,
      vehicleType: vData.vehicleType,
      manufacturer: vData.manufacturer,
      model: vData.model,
      year: Number(vData.year),
      fuelType: vData.fuelType,
      engineNumber: vData.engineNumber,
      odometer: Number(vData.odometer || 0),
      driverId: null,
      routeId: null,
      status: 'Standby',
      speed: 0,
      fuel: 100,
      battery: 100,
      temperature: 82,
      engineRpm: 0,
      engineLoad: 0,
      throttle: 0,
      coolant: 85,
      oilTemp: 90,
      intake: 35,
      fuelRate: 0,
      gpsAccuracy: 1.5,
      hdop: 0.9,
      pdop: 1.5,
      satellites: 12,
      gsmSignal: 90,
      signalStrength: -65,
      networkType: '5G SA',
      operator: 'Etisalat UAE',
      simStatus: 'Active',
      satelliteLink: 'Iridium NEXT',
      connectivityQuality: 'Excellent',
      ignition: false,
      movement: false,
      engineStatus: 'Stopped',
      powerSource: 'External',
      sleepMode: 'Disabled',
      deviceHealth: 'Optimal',
      lat: 25.06,
      lng: 55.21,
      heading: 0,
      tripStatus: 'Standby',
      currentStopIdx: 0,
      routeProgress: 0,
      harshBraking: 0,
      harshAcceleration: 0,
      harshCornering: 0,
      overspeed: 0,
      idling: 0,
      ecoScore: 95,
      drivingScore: 98,
      avgSpeed: 0,
      maxSpeed: 0,
      drivingTime: 0,
      idleTime: 0,
      engineRuntime: 0,
      lastUpdate: new Date().toISOString(),
      image: vData.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
      customParams: {},
      history: {
        speed: Array.from({length:20}, () => 0),
        fuel: Array.from({length:20}, () => 100),
        battery: Array.from({length:20}, () => 100),
        temperature: Array.from({length:20}, () => 82),
        rpm: Array.from({length:20}, () => 0),
        signal: Array.from({length:20}, () => -65),
        distance: Array.from({length:20}, () => 0)
      }
    };
    
    configsRef.current.forEach(cfg => {
      const val = Math.round((Math.random() * (cfg.max - cfg.min) + cfg.min) * 10) / 10;
      newVeh.customParams[cfg.id] = {
        label: cfg.label,
        value: val,
        unit: cfg.unit,
        category: cfg.category,
        history: Array.from({length: 20}, () => val)
      };
    });

    setVehicles(prev => [...prev, newVeh]);
  }, []);

  const createTrip = useCallback((vehicleId, driverId, routeId) => {
    setVehicles(prev => prev.map(v => {
      let newDriverId = v.driverId;
      if (v.driverId === driverId) {
        newDriverId = null;
      }
      if (v.id === vehicleId) {
        return {
          ...v,
          driverId: driverId,
          routeId: routeId,
          routeProgress: 0,
          currentStopIdx: 0,
          status: 'Scheduled',
          speed: 0,
          engineRpm: 0,
          ignition: false,
          movement: false
        };
      }
      return {
        ...v,
        driverId: newDriverId
      };
    }));
  }, []);

  const startTrip = useCallback((vehicleId) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return {
          ...v,
          status: 'Moving',
          ignition: true,
          movement: true,
          engineStatus: 'Running',
          routeProgress: 0,
          currentStopIdx: 0,
          tripOdometer: 0
        };
      }
      return v;
    }));
  }, []);

  // Dispatch a manual critical alert to the command center
  const triggerAlert = useCallback((vehicleId, type, severity, message) => {
    const newAlert = {
      id: `AL-CRIT-${Date.now()}-${Math.floor(Math.random()*999)}`,
      ts: new Date().toISOString(),
      vehicleId,
      type,
      severity,
      message
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 60));
  }, []);

  // Trigger telemetry spike (simulation anomaly)
  const triggerTelemetryAnomaly = useCallback((vehicleId, metricKey, value, alertMsg) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        if (v.customParams?.[metricKey]) {
          return {
            ...v,
            customParams: {
              ...v.customParams,
              [metricKey]: {
                ...v.customParams[metricKey],
                value: value,
                history: [...v.customParams[metricKey].history.slice(1), value]
              }
            }
          };
        } else if (metricKey in v) {
          const prevHistory = v.history[metricKey] || Array.from({length: 20}, () => v[metricKey] || 0);
          return {
            ...v,
            [metricKey]: value,
            history: {
              ...v.history,
              [metricKey]: [...prevHistory.slice(1), value]
            }
          };
        }
      }
      return v;
    }));
    triggerAlert(vehicleId, metricKey, 'critical', alertMsg);
  }, [triggerAlert]);

  const value = {
    vehicles,
    alerts,
    kpis,
    selectedId,
    setSelectedId,
    session,
    login,
    logout,
    activeView,
    setActiveView,
    drivers,
    addDriver,
    routes: ROUTES,
    customTelemetryConfigs,
    addCustomTelemetryConfig,
    assignRoute,
    assignVehicle,
    addVehicle,
    createTrip,
    startTrip,
    triggerAlert,
    triggerTelemetryAnomaly
  };

  return <FleetCtx.Provider value={value}>{children}</FleetCtx.Provider>;
}

export function useFleet() {
  const ctx = useContext(FleetCtx);
  if (!ctx) throw new Error('useFleet must be used within FleetProvider');
  return ctx;
}
