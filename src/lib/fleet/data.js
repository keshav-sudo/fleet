// Mock UAE fleet data + realtime simulation engine

const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const round = (n, d=1) => Math.round(n * 10**d) / 10**d;

export const DRIVERS = [
  { id:'DRV-1001', empId:'EMP-84210', name:'Ahmed Al Mansoori',   photo:'https://i.pravatar.cc/120?img=12', emiratesId:'784-1988-1234567-1', license:'DXB-DL-882341', phone:'+971 50 442 1188', experience:'12 yrs', status:'Driving', nationality: 'Emirati' },
  { id:'DRV-1002', empId:'EMP-84211', name:'Rashid Al Suwaidi',    photo:'https://i.pravatar.cc/120?img=13', emiratesId:'784-1985-2233445-2', license:'DXB-DL-771122', phone:'+971 52 118 8823', experience:'9 yrs',  status:'Driving', nationality: 'Emirati' },
  { id:'DRV-1003', empId:'EMP-84212', name:'Omar Al Marzouqi',     photo:'https://i.pravatar.cc/120?img=14', emiratesId:'784-1990-9988771-4', license:'AUH-DL-441233', phone:'+971 55 331 8890', experience:'6 yrs',  status:'Break', nationality: 'Emirati' },
  { id:'DRV-1004', empId:'EMP-84213', name:'Khalid Al Nuaimi',     photo:'https://i.pravatar.cc/120?img=15', emiratesId:'784-1982-4451188-3', license:'SHJ-DL-118843', phone:'+971 50 991 4432', experience:'15 yrs', status:'Driving', nationality: 'Emirati' },
  { id:'DRV-1005', empId:'EMP-84214', name:'Saif Al Shamsi',       photo:'https://i.pravatar.cc/120?img=33', emiratesId:'784-1993-3312455-9', license:'DXB-DL-994412', phone:'+971 56 224 8871', experience:'4 yrs',  status:'Driving', nationality: 'Emirati' },
  { id:'DRV-1006', empId:'EMP-84215', name:'Youssef Al Blooshi',   photo:'https://i.pravatar.cc/120?img=52', emiratesId:'784-1987-8823441-5', license:'DXB-DL-334412', phone:'+971 52 887 4419', experience:'11 yrs', status:'Driving', nationality: 'Emirati' },
  { id:'DRV-1007', empId:'EMP-84216', name:'Hamdan Al Falasi',     photo:'https://i.pravatar.cc/120?img=68', emiratesId:'784-1991-7712334-2', license:'DXB-DL-556789', phone:'+971 50 776 1123', experience:'8 yrs',  status:'Online', nationality: 'Emirati' },
  { id:'DRV-1008', empId:'EMP-84217', name:'Majid Al Ketbi',       photo:'https://i.pravatar.cc/120?img=60', emiratesId:'784-1984-1123456-8', license:'AUH-DL-667123', phone:'+971 55 442 9911', experience:'13 yrs', status:'Driving', nationality: 'Emirati' },
  { id:'DRV-1009', empId:'EMP-84218', name:'Faisal Al Zaabi',      photo:'https://i.pravatar.cc/120?img=59', emiratesId:'784-1989-9911223-6', license:'SHJ-DL-889923', phone:'+971 56 118 7742', experience:'7 yrs',  status:'Offline', nationality: 'Emirati' },
  { id:'DRV-1010', empId:'EMP-84219', name:'Tariq Al Hosani',      photo:'https://i.pravatar.cc/120?img=17', emiratesId:'784-1992-4488221-7', license:'DXB-DL-224488', phone:'+971 52 991 3348', experience:'5 yrs',  status:'Driving', nationality: 'Emirati' },
];

// 10 UAE routes covering all 7 Emirates
export const ROUTES = [
  { id:'RT-01', name:'Downtown Dubai → Dubai Marina', stops:['Burj Khalifa','DIFC','Trade Centre','Al Wasl','JLT','Dubai Marina'], distanceKm: 22, coords:[[25.1972,55.2744],[25.2140,55.2810],[25.2260,55.2870],[25.2050,55.2680],[25.1730,55.2410],[25.1000,55.1400],[25.0779,55.1345]], emirates: ['Dubai'] },
  { id:'RT-02', name:'Deira Dubai → Sharjah City Centre', stops:['Deira Souq','Al Rashidiya','Al Qusais','Al Nahda','University City','Al Majaz'], distanceKm: 32, coords:[[25.2711,55.3096],[25.2833,55.3944],[25.3020,55.4200],[25.3200,55.4400],[25.3400,55.4700],[25.3548,55.3908]], emirates: ['Dubai', 'Sharjah'] },
  { id:'RT-03', name:'Dubai → Abu Dhabi Highway (E11)', stops:['Jebel Ali','Ghantoot','Yas Island','Saadiyat','Corniche','ADNEC'], distanceKm: 138, coords:[[25.0000,55.1000],[24.8600,54.8400],[24.7400,54.6200],[24.6100,54.5100],[24.5100,54.4400],[24.4670,54.3660],[24.4300,54.4400]], emirates: ['Dubai', 'Abu Dhabi'] },
  { id:'RT-04', name:'Al Ain → Abu Dhabi Highway', stops:['Al Ain','Al Wathba','Al Shahama','Yas','Reem Island','Corniche'], distanceKm: 152, coords:[[24.2075,55.7447],[24.3200,55.4000],[24.4400,54.9800],[24.4830,54.6060],[24.4900,54.4100],[24.4720,54.3720]], emirates: ['Abu Dhabi'] },
  { id:'RT-05', name:'Business Bay Loop', stops:['Business Bay','Downtown','City Walk','DIFC','La Mer','Jumeirah'], distanceKm: 28, coords:[[25.1863,55.2760],[25.1972,55.2744],[25.2050,55.2570],[25.2140,55.2810],[25.2260,55.2470],[25.2050,55.2400],[25.1863,55.2760]], emirates: ['Dubai'] },
  { id:'RT-06', name:'Sharjah → Ajman → UAQ → RAK Coastal', stops:['Sharjah','Ajman','Umm Al Quwain','Ras Al Khaimah'], distanceKm: 95, coords:[[25.3548,55.3908],[25.4111,55.4353],[25.5647,55.5533],[25.6741,55.7811],[25.7891,55.9432]], emirates: ['Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah'] },
  { id:'RT-07', name:'Jebel Ali Port Circuit', stops:['Gate 1','Terminal 2','Cold Storage','Container Yard','Gate 5','Depot'], distanceKm: 18, coords:[[24.9857,55.0619],[24.9750,55.0520],[24.9670,55.0700],[24.9820,55.0850],[24.9950,55.0800],[25.0100,55.0700],[24.9857,55.0619]], emirates: ['Dubai'] },
  { id:'RT-08', name:'Al Qudra Desert Patrol', stops:['Al Qudra Gate','Love Lake','Camel Farm','Bab Al Shams','Return'], distanceKm: 65, coords:[[24.9600,55.3200],[24.8300,55.3700],[24.7900,55.4400],[24.8600,55.5100],[24.9200,55.4600],[24.9600,55.3200]], emirates: ['Dubai'] },
  { id:'RT-09', name:'Umm Al Quwain Marina ⇄ Dubai Terminal 3', stops:['UAQ Marina', 'Ajman City', 'Sharjah Border', 'Dubai Airport T3'], distanceKm: 62, coords:[[25.5647,55.5533],[25.4111,55.4353],[25.3200,55.4400],[25.2494,55.3537]], emirates: ['Umm Al Quwain', 'Ajman', 'Sharjah', 'Dubai'] },
  { id:'RT-10', name:'RAK City ⇄ Fujairah Port Scenic Route', stops:['RAK City', 'Dibba Al Fujairah', 'Khor Fakkan', 'Fujairah Port'], distanceKm: 120, coords:[[25.7891,55.9432],[25.6178,56.2708],[25.3313,56.3578],[25.1164,56.3601]], emirates: ['Ras Al Khaimah', 'Fujairah', 'Sharjah'] }
];

export const DEFAULT_CUSTOM_CONFIGS = [
  { id: 'tyre_pressure_fl', label: 'Tyre Pressure FL', min: 2.1, max: 2.6, unit: 'bar', category: 'Tyres' },
  { id: 'tyre_pressure_fr', label: 'Tyre Pressure FR', min: 2.1, max: 2.6, unit: 'bar', category: 'Tyres' },
  { id: 'tyre_temp_fl', label: 'Tyre Temp FL', min: 30, max: 65, unit: '°C', category: 'Tyres' },
  { id: 'tyre_temp_fr', label: 'Tyre Temp FR', min: 30, max: 65, unit: '°C', category: 'Tyres' },
  { id: 'cargo_temp', label: 'Cargo Chamber Temp', min: -18, max: 8, unit: '°C', category: 'Cargo' },
  { id: 'cabin_humidity', label: 'Cabin Humidity', min: 30, max: 60, unit: '%', category: 'Cabin' }
];

const VEHICLE_TYPES = [
  { type:'SUV Patrol',        mfr:'Toyota',    model:'Land Cruiser',   fuel:'Diesel',  img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&auto=format' },
  { type:'Pickup Utility',    mfr:'Ford',      model:'F-150 Raptor',   fuel:'Petrol',  img:'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format' },
  { type:'Cargo Van',         mfr:'Mercedes',  model:'Sprinter 415',   fuel:'Diesel',  img:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&auto=format' },
  { type:'Sedan Field Ops',   mfr:'Nissan',    model:'Altima SR',      fuel:'Petrol',  img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format' },
  { type:'Heavy Truck',       mfr:'MAN',       model:'TGS 33.480',     fuel:'Diesel',  img:'https://images.unsplash.com/photo-1601584115197-04ecc0da31d1?w=600&auto=format' },
  { type:'EV Fleet',          mfr:'Tesla',     model:'Model Y LR',     fuel:'Electric',img:'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format' },
  { type:'Airport Tug',       mfr:'Volvo',     model:'FMX Ground',     fuel:'Diesel',  img:'https://images.unsplash.com/photo-1601584115197-04ecc0da31d1?w=600&auto=format' },
  { type:'Emergency Response',mfr:'Chevrolet', model:'Tahoe PPV',      fuel:'Petrol',  img:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format' },
];

const PLATES = ['DXB-101','DXB-102','DXB-205','SHJ-301','AUH-405','DXB-712','SHJ-448','AUH-559','DXB-899','RAK-220'];
const COLORS = ['Pearl White','Onyx Black','Silver Metallic','Slate Blue','Sand Beige','Graphite Grey'];

function buildVehicles() {
  return PLATES.map((code, i) => {
    const vt = VEHICLE_TYPES[i % VEHICLE_TYPES.length];
    const route = ROUTES[i % ROUTES.length];
    const driver = DRIVERS[i % DRIVERS.length];
    const start = route.coords[0];
    
    // Build initial custom parameters
    const customParams = {};
    DEFAULT_CUSTOM_CONFIGS.forEach(cfg => {
      const val = round(rand(cfg.min, cfg.max), 1);
      customParams[cfg.id] = {
        label: cfg.label,
        value: val,
        unit: cfg.unit,
        category: cfg.category,
        history: Array.from({length:20}, () => round(rand(cfg.min, cfg.max), 1))
      };
    });

    return {
      id: code,
      vehicleNumber: code,
      plate: `${code}${100 + i}`,
      vehicleType: vt.type,
      manufacturer: vt.mfr,
      model: vt.model,
      year: 2021 + (i % 4),
      vin: `WBA${(Math.random()*1e10|0).toString().padStart(10,'0')}UAE`,
      engineNumber: `ENG-${100000 + i * 4921}M`,
      color: pick(COLORS),
      fuelType: vt.fuel,
      image: vt.img,
      driverId: driver.id,
      routeId: route.id,
      lat: start[0],
      lng: start[1],
      altitude: round(rand(5, 60)),
      heading: round(rand(0, 360)),
      speed: round(rand(35, 95)),
      fuel: round(rand(35, 95)),
      battery: round(rand(60, 100)),
      externalVoltage: round(rand(13.8, 14.4), 2),
      batteryVoltage: round(rand(12.4, 12.9), 2),
      batteryCurrent: round(rand(0.4, 6.5), 2),
      temperature: round(rand(28, 42)),
      engineRpm: round(rand(900, 3600)),
      engineLoad: round(rand(20, 78)),
      throttle: round(rand(10, 65)),
      coolant: round(rand(78, 95)),
      oilTemp: round(rand(80, 105)),
      intake: round(rand(30, 45)),
      fuelRate: round(rand(6, 18), 1),
      fuelPressure: round(rand(3.1, 4.2), 2),
      distanceTravelled: round(rand(5, 120)),
      remainingDistance: round(rand(3, 80)),
      etaMin: Math.round(rand(6, 55)),
      odometer: 45000 + i * 3412 + Math.round(rand(100, 900)),
      tripOdometer: round(rand(20, 320)),
      remainingFuelRange: round(rand(120, 620)),
      distanceUntilService: round(rand(200, 4200)),
      gpsAccuracy: round(rand(1.2, 4.8), 1),
      hdop: round(rand(0.6, 1.9), 2),
      pdop: round(rand(1.1, 2.8), 2),
      satellites: Math.round(rand(8, 18)),
      gsmSignal: Math.round(rand(70, 100)),
      signalStrength: Math.round(rand(-85, -55)),
      networkType: pick(['4G LTE','5G NSA','4G LTE','5G SA','4G LTE']),
      operator: pick(['Etisalat UAE','du Telecom']),
      simStatus: 'Active',
      satelliteLink: pick(['Iridium NEXT','Thuraya','Inmarsat','Iridium NEXT']),
      connectivityQuality: 'Excellent',
      ignition: true,
      movement: true,
      engineStatus: 'Running',
      powerSource: 'External',
      sleepMode: 'Disabled',
      deviceHealth: 'Optimal',
      status: 'Moving',
      tripStatus: 'In Progress',
      currentStopIdx: 0,
      routeProgress: round(rand(5, 60)),
      harshBraking: Math.round(rand(0, 3)),
      harshAcceleration: Math.round(rand(0, 4)),
      harshCornering: Math.round(rand(0, 3)),
      overspeed: Math.round(rand(0, 2)),
      idling: Math.round(rand(2, 18)),
      ecoScore: Math.round(rand(72, 96)),
      drivingScore: Math.round(rand(78, 98)),
      avgSpeed: Math.round(rand(48, 82)),
      maxSpeed: Math.round(rand(95, 140)),
      drivingTime: Math.round(rand(45, 320)),
      idleTime: Math.round(rand(5, 45)),
      engineRuntime: Math.round(rand(60, 380)),
      lastUpdate: new Date().toISOString(),
      customParams: customParams,
      history: {
        speed:       Array.from({length:20},()=> Math.round(rand(40,110))),
        fuel:        Array.from({length:20},(_,k)=> round(90 - k*rand(0.4,1.2))),
        battery:     Array.from({length:20},()=> round(rand(88,100))),
        temperature: Array.from({length:20},()=> round(rand(70,95))),
        rpm:         Array.from({length:20},()=> Math.round(rand(1200,3200))),
        signal:      Array.from({length:20},()=> Math.round(rand(-85,-55))),
        distance:    Array.from({length:20},(_,k)=> Math.round(k*rand(4,7))),
      }
    };
  });
}

export const INITIAL_VEHICLES = buildVehicles();

export const ALERT_TEMPLATES = [
  { type:'speeding',    sev:'warning',  msg:v=>`Vehicle ${v.id} exceeded speed limit (${v.speed} km/h)` },
  { type:'geofence-in', sev:'info',     msg:v=>`Vehicle ${v.id} entered Geofence ${pick(['Zone A','Zone B','Depot','Port'])}` },
  { type:'geofence-out',sev:'info',     msg:v=>`Vehicle ${v.id} exited Geofence ${pick(['Zone A','Zone B','Depot','Port'])}` },
  { type:'satellite',   sev:'success',  msg:v=>`Satellite link active — ${v.satelliteLink}` },
  { type:'gsm-weak',    sev:'warning',  msg:v=>`Weak GSM signal on ${v.id} (${v.signalStrength} dBm)` },
  { type:'offline',     sev:'critical', msg:v=>`Vehicle ${v.id} went offline briefly, reconnected` },
  { type:'crash',       sev:'critical', msg:v=>`Crash detection anomaly cleared on ${v.id}` },
  { type:'tow',         sev:'warning',  msg:v=>`Unauthorized tow signal on ${v.id}` },
  { type:'maintenance', sev:'warning',  msg:v=>`Maintenance due in ${v.distanceUntilService} km — ${v.id}` },
  { type:'batt-low',    sev:'warning',  msg:v=>`Battery low on ${v.id} (${v.battery}%)` },
  { type:'fuel-low',    sev:'warning',  msg:v=>`Fuel below 20% on ${v.id} (${v.fuel}%)` },
  { type:'engine',      sev:'critical', msg:v=>`Engine warning cleared on ${v.id}` },
  { type:'route',       sev:'info',     msg:(v,r)=>`Vehicle ${v.id} entered ${r?.name || 'route'}` },
];

function advanceVehicle(v, route, customConfigs = []) {
  if (v.status === 'Scheduled' || v.status === 'Standby' || v.status === 'Completed' || v.status === 'Stopped') {
    // Fluctuate custom parameters but keep telemetry at idle/stopped state
    const updatedCustomParams = {};
    const configsToUse = customConfigs.length > 0 ? customConfigs : DEFAULT_CUSTOM_CONFIGS;
    configsToUse.forEach(cfg => {
      const prevParam = v.customParams?.[cfg.id];
      const prevVal = prevParam ? prevParam.value : rand(cfg.min, cfg.max);
      const step = (cfg.max - cfg.min) * 0.02;
      let nextVal = prevVal + rand(-step, step);
      if (nextVal < cfg.min) nextVal = cfg.min;
      if (nextVal > cfg.max) nextVal = cfg.max;
      nextVal = round(nextVal, 1);

      const prevHistory = prevParam?.history || Array.from({length: 20}, () => round(rand(cfg.min, cfg.max), 1));
      const nextHistory = [...prevHistory.slice(1), nextVal];

      updatedCustomParams[cfg.id] = {
        label: cfg.label,
        value: nextVal,
        unit: cfg.unit,
        category: cfg.category,
        history: nextHistory
      };
    });

    return {
      ...v,
      speed: 0,
      engineRpm: 0,
      ignition: false,
      movement: false,
      engineStatus: 'Stopped',
      customParams: updatedCustomParams,
      lastUpdate: new Date().toISOString(),
      history: {
        speed:       [...v.history.speed.slice(1),       0],
        fuel:        [...v.history.fuel.slice(1),        round(v.fuel,1)],
        battery:     [...v.history.battery.slice(1),     round(v.battery,1)],
        temperature: [...v.history.temperature.slice(1), round(60,1)],
        rpm:         [...v.history.rpm.slice(1),         0],
        signal:      [...v.history.signal.slice(1),      Math.round(v.signalStrength)],
        distance:    [...v.history.distance.slice(1),    Math.round(v.distanceTravelled)],
      }
    };
  }

  const path = route ? route.coords : [[25.05, 55.2], [25.06, 55.21]];
  const p = Math.min(0.9999, (v.routeProgress + rand(0.6, 2.0)) / 100);
  const idxFloat = p * (path.length - 1);
  const i = Math.floor(idxFloat);
  const t = idxFloat - i;
  const [la, lo] = path[i];
  const [lb, lob] = path[Math.min(path.length-1, i+1)];
  const lat = la + (lb - la) * t;
  const lng = lo + (lob - lo) * t;
  const dy = (lb - la), dx = (lob - lo);
  const heading = ((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360;
  const routeProgress = route ? Math.min(100, v.routeProgress + rand(0.4, 1.4)) : 0;
  const speed = Math.max(0, Math.min(140, v.speed + rand(-6, 6)));
  const fuel = Math.max(4, v.fuel - rand(0.02, 0.12));
  const battery = Math.max(30, Math.min(100, v.battery + rand(-0.4, 0.3)));
  const temperature = Math.max(60, Math.min(105, v.temperature + rand(-0.6, 0.6)));
  const engineRpm = Math.max(700, Math.min(4200, v.engineRpm + rand(-140, 140)));
  const signalStrength = Math.max(-105, Math.min(-45, v.signalStrength + rand(-2, 2)));
  const distanceTravelled = round(v.distanceTravelled + speed/3600*2.5, 2);
  const remainingDistance = route ? Math.max(0, round(v.remainingDistance - speed/3600*2.5, 2)) : 0;
  const etaMin = route ? Math.max(0, Math.round(remainingDistance / Math.max(20, speed) * 60)) : 0;
  const currentStopIdx = route ? Math.min(route.stops.length-1, Math.floor(routeProgress/100 * route.stops.length)) : 0;

  // Fluctuate custom parameters
  const updatedCustomParams = {};
  const configsToUse = customConfigs.length > 0 ? customConfigs : DEFAULT_CUSTOM_CONFIGS;
  configsToUse.forEach(cfg => {
    const prevParam = v.customParams?.[cfg.id];
    const prevVal = prevParam ? prevParam.value : rand(cfg.min, cfg.max);
    const step = (cfg.max - cfg.min) * 0.04;
    let nextVal = prevVal + rand(-step, step);
    if (nextVal < cfg.min) nextVal = cfg.min;
    if (nextVal > cfg.max) nextVal = cfg.max;
    nextVal = round(nextVal, 1);

    const prevHistory = prevParam?.history || Array.from({length: 20}, () => round(rand(cfg.min, cfg.max), 1));
    const nextHistory = [...prevHistory.slice(1), nextVal];

    updatedCustomParams[cfg.id] = {
      label: cfg.label,
      value: nextVal,
      unit: cfg.unit,
      category: cfg.category,
      history: nextHistory
    };
  });

  return {
    ...v,
    lat: round(lat, 5), lng: round(lng, 5),
    heading: round(heading),
    speed: round(speed),
    fuel: round(fuel, 1),
    battery: round(battery, 1),
    temperature: round(temperature, 1),
    engineRpm: round(engineRpm),
    engineLoad: round(Math.max(10, Math.min(95, v.engineLoad + rand(-3,3)))),
    throttle: round(Math.max(0, Math.min(100, v.throttle + rand(-4,4)))),
    coolant: round(Math.max(60, Math.min(105, v.coolant + rand(-0.5, 0.5))), 1),
    oilTemp: round(Math.max(60, Math.min(115, v.oilTemp + rand(-0.4, 0.4))), 1),
    intake: round(Math.max(25, Math.min(55, v.intake + rand(-0.3, 0.3))), 1),
    fuelRate: round(Math.max(3, Math.min(22, v.fuelRate + rand(-0.4,0.4))), 1),
    signalStrength: round(signalStrength),
    gsmSignal: Math.max(35, Math.min(100, Math.round(v.gsmSignal + rand(-2,2)))),
    satellites: Math.max(4, Math.min(22, Math.round(v.satellites + rand(-0.4,0.4)))),
    hdop: round(Math.max(0.4, Math.min(3, v.hdop + rand(-0.05, 0.05))), 2),
    pdop: round(Math.max(0.6, Math.min(4, v.pdop + rand(-0.05, 0.05))), 2),
    gpsAccuracy: round(Math.max(0.8, Math.min(6, v.gpsAccuracy + rand(-0.1, 0.1))), 1),
    externalVoltage: round(Math.max(12, Math.min(14.7, v.externalVoltage + rand(-0.05, 0.05))), 2),
    batteryVoltage: round(Math.max(11.5, Math.min(13.2, v.batteryVoltage + rand(-0.05, 0.05))), 2),
    batteryCurrent: round(Math.max(0.2, Math.min(9, v.batteryCurrent + rand(-0.3, 0.3))), 2),
    distanceTravelled, remainingDistance, etaMin,
    tripOdometer: round(v.tripOdometer + speed/3600*2.5, 2),
    odometer: v.odometer + speed/3600*2.5,
    routeProgress: round(routeProgress, 1),
    currentStopIdx,
    status: speed < 3 ? 'Idle' : 'Moving',
    lastUpdate: new Date().toISOString(),
    customParams: updatedCustomParams,
    history: {
      speed:       [...v.history.speed.slice(1),       Math.round(speed)],
      fuel:        [...v.history.fuel.slice(1),        round(fuel,1)],
      battery:     [...v.history.battery.slice(1),     round(battery,1)],
      temperature: [...v.history.temperature.slice(1), round(temperature,1)],
      rpm:         [...v.history.rpm.slice(1),         Math.round(engineRpm)],
      signal:      [...v.history.signal.slice(1),      Math.round(signalStrength)],
      distance:    [...v.history.distance.slice(1),    Math.round(distanceTravelled)],
    }
  };
}

export function tickFleet(vehicles, customConfigs = []) {
  return vehicles.map(v => {
    const route = ROUTES.find(r => r.id === v.routeId);
    return advanceVehicle(v, route, customConfigs);
  });
}

export function maybeGenerateAlert(vehicles) {
  if (Math.random() > 0.55) return null;
  const v = pick(vehicles);
  const tpl = pick(ALERT_TEMPLATES);
  const route = ROUTES.find(r => r.id === v.routeId);
  return {
    id: `AL-${Date.now()}-${Math.floor(Math.random()*999)}`,
    ts: new Date().toISOString(),
    vehicleId: v.id,
    type: tpl.type,
    severity: tpl.sev,
    message: tpl.msg(v, route),
  };
}

export const INITIAL_ALERTS = [
  { id:'AL-INIT-1', ts:new Date(Date.now()-60_000).toISOString(),  vehicleId:'DXB-101', type:'satellite',   severity:'success',  message:'Satellite link active — Iridium NEXT' },
  { id:'AL-INIT-2', ts:new Date(Date.now()-120_000).toISOString(), vehicleId:'DXB-205', type:'geofence-in', severity:'info',     message:'Vehicle DXB-205 entered Route 4' },
  { id:'AL-INIT-3', ts:new Date(Date.now()-240_000).toISOString(), vehicleId:'SHJ-301', type:'speeding',    severity:'warning',  message:'Vehicle SHJ-301 exceeded speed limit (128 km/h)' },
  { id:'AL-INIT-4', ts:new Date(Date.now()-360_000).toISOString(), vehicleId:'AUH-405', type:'maintenance', severity:'warning',  message:'Maintenance due in 320 km — AUH-405' },
  { id:'AL-INIT-5', ts:new Date(Date.now()-540_000).toISOString(), vehicleId:'DXB-712', type:'fuel-low',    severity:'warning',  message:'Fuel below 20% on DXB-712 (18%)' },
];
