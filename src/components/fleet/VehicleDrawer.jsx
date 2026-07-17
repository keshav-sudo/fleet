'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Truck, User, Navigation, Signal, Fuel, Gauge,
  ShieldCheck, Route as RouteIcon, Activity
} from 'lucide-react';
import { useFleet } from '@/lib/fleet/store';
import { ROUTES, DRIVERS } from '@/lib/fleet/data';
import { Gauge2, MiniArea, StatBar } from './Widgets';

const KV = ({ k, v, mono=false }) => (
  <div className="flex justify-between items-center py-1.5 text-[12px] border-b border-slate-100 last:border-0">
    <span className="text-slate-500">{k}</span>
    <span className={`${mono?'font-mono':''} text-slate-900 font-medium tabular-nums`}>{v}</span>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-3">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="h-3.5 w-3.5 text-blue-600"/>
      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{title}</div>
    </div>
    <div>{children}</div>
  </div>
);

export default function VehicleDrawer() {
  const { selectedId, setSelectedId, vehicles } = useFleet();
  const v = vehicles.find(x => x.id === selectedId);
  const open = !!v;
  const route = v ? ROUTES.find(r => r.id === v.routeId) : null;
  const driver = v ? DRIVERS.find(d => d.id === v.driverId) : null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="scrim"
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[900]"
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setSelectedId(null)} />
          <motion.aside key="drawer"
            initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}}
            transition={{type:'spring', damping:28, stiffness:220}}
            className="fixed top-0 right-0 h-full w-full sm:w-[520px] bg-slate-50 z-[901] shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-br from-[#0a1330] to-[#0e1a45] text-white px-5 py-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">{v.vehicleType}</div>
                <div className="text-xl font-bold">{v.id} <span className="text-white/50 text-sm font-normal">· {v.plate}</span></div>
                <div className="mt-1 inline-flex items-center gap-2 text-[11px] text-emerald-300">
                  <span className="live-dot"/> {v.status} · {v.speed} km/h · ETA {v.etaMin}m
                </div>
              </div>
              <button onClick={()=>setSelectedId(null)} className="h-8 w-8 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center">
                <X className="h-4 w-4"/>
              </button>
            </div>

            <div className="p-4 space-y-3">
              {/* Vehicle Image + Info */}
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                <div className="h-40 bg-slate-100 relative">
                  <img src={v.image} alt={v.model} className="w-full h-full object-cover no-drag" />
                  <div className="absolute bottom-2 left-2 glass rounded-lg px-2 py-1 text-[11px] flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 text-blue-600"/>{v.manufacturer} {v.model} · {v.year}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0 p-3">
                  <KV k="VIN" v={v.vin} mono />
                  <KV k="Color" v={v.color} />
                  <KV k="Fuel Type" v={v.fuelType} />
                  <KV k="Odometer" v={`${Math.round(v.odometer).toLocaleString()} km`} />
                </div>
              </div>

              {/* Driver */}
              {driver && (
                <Section title="Current Driver" icon={User}>
                  <div className="flex items-center gap-3">
                    <img src={driver.photo} className="h-12 w-12 rounded-full object-cover border border-slate-200" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900">{driver.name}</div>
                      <div className="text-[11px] text-slate-500">{driver.empId} · {driver.license}</div>
                      <div className="text-[11px] text-slate-500">Emirates ID: {driver.emiratesId}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">{driver.status}</span>
                  </div>
                </Section>
              )}

              {/* Route & Trip */}
              <Section title="Route & Trip" icon={RouteIcon}>
                <div className="text-sm font-semibold text-slate-900">{route?.name}</div>
                <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{width:`${v.routeProgress}%`}}/>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>{v.routeProgress}% complete</span>
                  <span>{Math.round(100-v.routeProgress)}% remaining</span>
                </div>
                <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
                  {route?.stops.map((s, i) => (
                    <div key={i}
                      className={`whitespace-nowrap text-[11px] px-2 py-1 rounded-md border ${i<=v.currentStopIdx?'bg-blue-600 text-white border-blue-600':'bg-white text-slate-600 border-slate-200'}`}>
                      {i===v.currentStopIdx && '• '}{s}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-x-4 mt-3">
                  <KV k="Current Stop" v={route?.stops[v.currentStopIdx]} />
                  <KV k="Next Stop" v={route?.stops[Math.min(route.stops.length-1, v.currentStopIdx+1)]} />
                  <KV k="Destination" v={route?.stops[route.stops.length-1]} />
                  <KV k="Trip Status" v={v.tripStatus} />
                </div>
              </Section>

              {/* Live GPS */}
              <Section title="Live GPS" icon={Navigation}>
                <div className="grid grid-cols-2 gap-x-4">
                  <KV k="Latitude"  v={v.lat.toFixed(5)} mono />
                  <KV k="Longitude" v={v.lng.toFixed(5)} mono />
                  <KV k="Altitude"  v={`${v.altitude} m`} />
                  <KV k="Heading"   v={`${v.heading}°`} />
                  <KV k="Speed"     v={`${v.speed} km/h`} />
                  <KV k="Distance Travelled" v={`${v.distanceTravelled} km`} />
                  <KV k="Remaining Distance" v={`${v.remainingDistance} km`} />
                  <KV k="ETA"       v={`${v.etaMin} min`} />
                  <KV k="GPS Accuracy" v={`±${v.gpsAccuracy} m`} />
                  <KV k="Last Update" v={new Date(v.lastUpdate).toLocaleTimeString()} />
                </div>
              </Section>

              {/* Connectivity */}
              <Section title="Connectivity" icon={Signal}>
                <div className="grid grid-cols-2 gap-x-4">
                  <KV k="GSM Signal" v={`${v.gsmSignal}%`} />
                  <KV k="Signal Strength" v={`${v.signalStrength} dBm`} />
                  <KV k="Network" v={v.networkType} />
                  <KV k="Operator" v={v.operator} />
                  <KV k="Satellite Link" v={v.satelliteLink} />
                  <KV k="GNSS Status" v={`Locked · ${v.satellites} sats`} />
                  <KV k="HDOP" v={v.hdop} />
                  <KV k="PDOP" v={v.pdop} />
                  <KV k="SIM Status" v={v.simStatus} />
                  <KV k="Quality" v={v.connectivityQuality} />
                </div>
              </Section>

              {/* Vehicle Health */}
              <Section title="Vehicle Health" icon={ShieldCheck}>
                <div className="grid grid-cols-2 gap-x-4">
                  <KV k="Ignition" v={v.ignition ? 'ON' : 'OFF'} />
                  <KV k="Movement" v={v.movement ? 'Detected' : 'Stationary'} />
                  <KV k="Engine" v={v.engineStatus} />
                  <KV k="Battery Voltage" v={`${v.batteryVoltage} V`} />
                  <KV k="Battery Current" v={`${v.batteryCurrent} A`} />
                  <KV k="External Voltage" v={`${v.externalVoltage} V`} />
                  <KV k="Power Source" v={v.powerSource} />
                  <KV k="Sleep Mode" v={v.sleepMode} />
                  <KV k="Temperature" v={`${v.temperature} °C`} />
                  <KV k="Device Health" v={v.deviceHealth} />
                </div>
              </Section>

              {/* Engine & Fuel */}
              <Section title="Engine & Fuel" icon={Fuel}>
                <div className="grid grid-cols-2 gap-x-4">
                  <KV k="Fuel Level" v={`${v.fuel}%`} />
                  <KV k="Fuel Rate" v={`${v.fuelRate} L/h`} />
                  <KV k="Fuel Pressure" v={`${v.fuelPressure} bar`} />
                  <KV k="Engine RPM" v={v.engineRpm} />
                  <KV k="Engine Load" v={`${v.engineLoad}%`} />
                  <KV k="Throttle" v={`${v.throttle}%`} />
                  <KV k="Coolant Temp" v={`${v.coolant} °C`} />
                  <KV k="Oil Temp" v={`${v.oilTemp} °C`} />
                  <KV k="Intake Air" v={`${v.intake} °C`} />
                  <KV k="Distance Until Service" v={`${v.distanceUntilService} km`} />
                  <KV k="Trip Odometer" v={`${v.tripOdometer} km`} />
                  <KV k="Fuel Range" v={`${v.remainingFuelRange} km`} />
                </div>
              </Section>

              {/* Driving Behaviour */}
              <Section title="Driving Behaviour" icon={Activity}>
                <div className="grid grid-cols-2 gap-3">
                  <StatBar label="Eco Score" value={v.ecoScore} color="#10b981" unit="%" />
                  <StatBar label="Driving Score" value={v.drivingScore} color="#2563eb" unit="%" />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                  {[
                    ['Harsh Braking',v.harshBraking],
                    ['Harsh Accel',v.harshAcceleration],
                    ['Cornering',v.harshCornering],
                    ['Overspeed',v.overspeed],
                    ['Idling',`${v.idling}m`],
                    ['Max Speed',`${v.maxSpeed}`],
                  ].map(([k,val])=>(
                    <div key={k} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                      <div className="text-[10px] text-slate-500">{k}</div>
                      <div className="text-sm font-semibold text-slate-900 tabular-nums">{val}</div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Custom & Added Telemetry (Live) */}
              {v.customParams && Object.keys(v.customParams).length > 0 && (
                <Section title="Dynamic Operations Telemetry" icon={Gauge}>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(v.customParams).map(([key, cfg]) => (
                      <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                        <div className="flex justify-between items-center text-[10px] text-slate-500">
                          <span className="font-semibold">{cfg.label}</span>
                          <span className="text-slate-400">({cfg.category || 'General'})</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900 mt-1 tabular-nums">
                          {cfg.value}
                          <span className="text-[10px] font-normal text-slate-500 ml-0.5">{cfg.unit}</span>
                        </div>
                        <div className="h-8 w-full mt-1.5">
                          <MiniArea data={cfg.history || [cfg.value]} color="#2563eb" height={32}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Telemetry Gauges */}
              <Section title="Telemetry · Digital Dashboard" icon={Gauge}>
                <div className="grid grid-cols-3 gap-2">
                  <Gauge2 label="SPEED" value={v.speed} max={160} unit=" km/h" color="#2563eb" size={110}/>
                  <Gauge2 label="RPM"   value={v.engineRpm/1000} max={5} unit="k" color="#8b5cf6" size={110}/>
                  <Gauge2 label="FUEL"  value={v.fuel}  max={100} unit="%" color="#f59e0b" size={110}/>
                  <Gauge2 label="BATT"  value={v.battery} max={100} unit="%" color="#10b981" size={110}/>
                  <Gauge2 label="TEMP"  value={v.temperature} max={120} unit="°" color="#ef4444" size={110}/>
                  <div className="flex flex-col items-center justify-center">
                    <svg viewBox="0 0 100 100" width="90" height="90">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="#e5e7eb" strokeWidth="2"/>
                      <g transform={`rotate(${v.heading} 50 50)`}>
                        <path d="M50 12 L58 50 L50 44 L42 50 Z" fill="#2563eb"/>
                      </g>
                      <text x="50" y="22" textAnchor="middle" fontSize="9" fill="#64748b">N</text>
                      <text x="50" y="84" textAnchor="middle" fontSize="9" fill="#64748b">S</text>
                      <text x="14" y="54" textAnchor="middle" fontSize="9" fill="#64748b">W</text>
                      <text x="86" y="54" textAnchor="middle" fontSize="9" fill="#64748b">E</text>
                    </svg>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">Compass · {v.heading}°</div>
                  </div>
                </div>
              </Section>

              {/* Live charts */}
              <Section title="Realtime Charts" icon={Activity}>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Speed (km/h)', v.history.speed, '#2563eb'],
                    ['Fuel (%)', v.history.fuel, '#f59e0b'],
                    ['Battery (%)', v.history.battery, '#10b981'],
                    ['Temperature (°C)', v.history.temperature, '#ef4444'],
                    ['Engine RPM', v.history.rpm, '#8b5cf6'],
                    ['Signal (dBm)', v.history.signal, '#0ea5e9'],
                  ].map(([label, arr, color]) => (
                    <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                      <div className="text-[10px] text-slate-500 mb-1">{label}</div>
                      <MiniArea data={arr} color={color} height={54}/>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
