'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useFleet } from '@/lib/fleet/store';
import { ROUTES } from '@/lib/fleet/data';
import { Gauge2, MiniArea, StatBar, SectionCard } from './Widgets';
import {
  LogOut, Radar, Truck, MapPin, Navigation, Signal, Fuel,
  Gauge, Route as RouteIcon, ShieldCheck, Timer, Satellite, User, CreditCard, Globe, ArrowLeft, RefreshCw
} from 'lucide-react';

const FleetMap = dynamic(() => import('./FleetMap'), { ssr: false });

export default function DriverView() {
  const { session, logout, vehicles, drivers, setSelectedId, assignVehicle, customTelemetryConfigs, startTrip, triggerAlert, triggerTelemetryAnomaly } = useFleet();
  const driver = drivers.find(d => d.id === session?.driverId) || drivers[0];
  
  // Find vehicle assigned to this driver
  const vehicle = vehicles.find(v => v.driverId === driver.id);
  const isLockedToVehicle = !!(vehicle && (vehicle.routeId || vehicle.status === 'Scheduled' || vehicle.status === 'Moving'));
  const [isPickingVehicle, setIsPickingVehicle] = useState(!vehicle);
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize picker state with admin dispatches in real-time
  useEffect(() => {
    if (vehicle) {
      setIsPickingVehicle(false);
    } else {
      setIsPickingVehicle(true);
    }
  }, [vehicle]);

  // Fallback vehicle for calculations if none selected yet
  const activeVehicle = vehicle || vehicles[0];
  const route = ROUTES.find(r => r.id === activeVehicle.routeId);

  const availableVehicles = vehicles.filter(v => 
    v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectVehicle = (vehId) => {
    assignVehicle(vehId, driver.id);
    setIsPickingVehicle(false);
  };

  if (isPickingVehicle || !vehicle) {
    return (
      <div className="min-h-screen bg-[#050a1a] text-white">
        <header className="sticky top-0 z-20 bg-[#0a1330] border-b border-white/10 px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Radar className="h-4 w-4"/>
            </div>
            <div>
              <div className="text-sm font-bold">Driver Terminal</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Setup Mode</div>
            </div>
          </div>
          <button onClick={logout} className="h-8 px-3 rounded-md bg-white/10 hover:bg-white/20 inline-flex items-center gap-1.5 text-[12px] transition">
            <LogOut className="h-3.5 w-3.5"/>Sign out
          </button>
        </header>

        <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Driver Profile Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl bg-gradient-to-br from-[#0a1330] to-[#0e1a45] border border-white/10 p-5 space-y-4">
              <div className="flex flex-col items-center text-center">
                <img src={driver.photo} alt="" className="h-24 w-24 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/20"/>
                <h3 className="mt-3 text-lg font-bold text-white">{driver.name}</h3>
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">{driver.empId}</span>
              </div>
              <div className="border-t border-white/10 pt-4 space-y-3 text-sm">
                <div>
                  <span className="text-white/50 text-xs block uppercase">Nationality</span>
                  <span className="font-medium flex items-center gap-1.5 mt-0.5">
                    <Globe className="h-4 w-4 text-cyan-400" />
                    {driver.nationality}
                  </span>
                </div>
                <div>
                  <span className="text-white/50 text-xs block uppercase">Emirates ID</span>
                  <span className="font-mono flex items-center gap-1.5 mt-0.5">
                    <CreditCard className="h-4 w-4 text-cyan-400" />
                    {driver.emiratesId}
                  </span>
                </div>
                <div>
                  <span className="text-white/50 text-xs block uppercase">Driver License</span>
                  <span className="font-mono flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    {driver.license}
                  </span>
                </div>
                <div>
                  <span className="text-white/50 text-xs block uppercase">Experience</span>
                  <span className="font-medium mt-0.5 block">{driver.experience}</span>
                </div>
              </div>
            </div>
            {vehicle && (
              <button onClick={() => setIsPickingVehicle(false)} className="w-full py-2.5 rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10 font-semibold transition flex items-center justify-center gap-2 text-sm">
                <ArrowLeft className="h-4 w-4"/> Cancel and Return
              </button>
            )}
          </div>

          {/* Vehicle Selection List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Pick Your Vehicle</h2>
                <p className="text-sm text-white/60">Select an active vehicle to start streaming telemetry.</p>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm w-full sm:w-64">
                <input 
                  placeholder="Search vehicle number or type..." 
                  className="bg-transparent outline-none flex-1 placeholder-white/40"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableVehicles.map(v => {
                const isCurrent = vehicle?.id === v.id;
                const activeRoute = ROUTES.find(r => r.id === v.routeId);
                return (
                  <div key={v.id} className={`rounded-xl border ${isCurrent ? 'border-cyan-400 bg-[#0e2145]/40' : 'border-white/10 bg-[#0a1330]'} p-4 flex flex-col justify-between hover:border-cyan-500/50 transition`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">{v.vehicleType}</span>
                          <h4 className="text-lg font-bold mt-0.5">{v.id}</h4>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${v.status === 'Moving' ? 'bg-blue-500/20 text-blue-300' : 'bg-amber-500/20 text-amber-300'}`}>
                          {v.status}
                        </span>
                      </div>
                      <div className="mt-3 aspect-video rounded-lg overflow-hidden border border-white/5">
                        <img src={v.image} alt={v.model} className="w-full h-full object-cover"/>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/70">
                        <div>
                          <span className="text-white/40 text-[10px] block">PLATE</span>
                          <span className="font-semibold">{v.plate}</span>
                        </div>
                        <div>
                          <span className="text-white/40 text-[10px] block">ENGINE NO</span>
                          <span className="font-semibold font-mono">{v.engineNumber}</span>
                        </div>
                        <div>
                          <span className="text-white/40 text-[10px] block">MFR / YEAR</span>
                          <span className="font-semibold">{v.manufacturer} {v.year}</span>
                        </div>
                        <div>
                          <span className="text-white/40 text-[10px] block">ROUTE ASSIGNED</span>
                          <span className="font-semibold text-cyan-300 truncate block">
                            {activeRoute ? activeRoute.name.split('→')[0].split('⇄')[0] : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleSelectVehicle(v.id)}
                      className={`w-full mt-4 py-2 rounded-lg font-semibold text-sm transition ${isCurrent ? 'bg-cyan-400 text-[#050a1a] hover:bg-cyan-300' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                    >
                      {isCurrent ? 'Current Vehicle' : 'Select Vehicle'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Driver Dashboard View
  return (
    <div className="min-h-screen bg-[#f5f7fb] bg-radial-blue">
      <header className="sticky top-0 z-20 bg-[#0a1330] text-white">
        <div className="px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Radar className="h-4 w-4"/>
            </div>
            <div>
              <div className="text-sm font-bold">Driver Console</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Signed in · {driver.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {vehicle && !isLockedToVehicle && (
              <button 
                onClick={() => assignVehicle(vehicle.id, null)}
                className="h-8 px-3 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 inline-flex items-center gap-1.5 text-[12px] transition font-semibold"
              >
                <RefreshCw className="h-3.5 w-3.5"/> Switch Vehicle
              </button>
            )}
            {isLockedToVehicle && (
              <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] uppercase font-bold tracking-wider select-none">
                🔒 Dispatch Locked
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300">
              <span className="live-dot"/> On duty
            </span>
            <button onClick={logout} className="h-8 px-2 rounded-md bg-white/10 hover:bg-white/20 inline-flex items-center gap-1 text-[12px] transition">
              <LogOut className="h-3.5 w-3.5"/>Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4">
        {/* Welcome & Driver Info Card */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0a1330] to-[#0e1a45] text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 card-elev-lg">
          <div className="flex items-center gap-4">
            <img src={driver.photo} alt="" className="h-16 w-16 rounded-xl object-cover border border-white/20"/>
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">Assigned Driver Terminal</div>
              <div className="text-2xl font-bold">Welcome back, {driver.name.split(' ')[0]} 👋</div>
              <div className="text-white/70 text-sm mt-0.5">
                {driver.nationality} Driver License: <span className="font-mono text-cyan-300">{driver.license}</span> · Emirates ID: <span className="font-mono text-cyan-300">{driver.emiratesId}</span>
              </div>
            </div>
          </div>
          <div className="text-left md:text-right border-t border-white/10 md:border-t-0 pt-3 md:pt-0">
            <div className="text-[11px] text-white/60">Emp ID</div>
            <div className="font-mono text-lg font-bold">{driver.empId}</div>
          </div>
        </div>

        {/* Scheduled Trip Alert Banner */}
        {vehicle.status === 'Scheduled' && (
          <div className="rounded-2xl border border-indigo-400/50 bg-[#121330] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-indigo-500/10 text-white border-dashed">
            <div>
              <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                Scheduled Dispatch Pending
              </div>
              <h4 className="text-lg font-bold mt-1">Assigned Corridor: {route ? route.name : 'Standby / Maintenance Corridor'}</h4>
              <p className="text-xs text-white/70 mt-0.5">Your vehicle is pre-allocated. Click the dispatch button to switch systems on, start engine RPM, and begin GPS route tracking.</p>
            </div>
            <button 
              onClick={() => startTrip(vehicle.id)}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-2.5 px-6 rounded-xl text-sm transition shrink-0 shadow-md shadow-cyan-500/20"
            >
              Start Trip & Begin Shift
            </button>
          </div>
        )}

        {/* Assigned Vehicle Panel */}
        <SectionCard
          title={`Assigned Vehicle: ${vehicle.id}`}
          subtitle={`${vehicle.manufacturer} ${vehicle.model} · Year ${vehicle.year} · Plate: ${vehicle.plate}`}
          right={
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 font-semibold font-mono">Engine No: {vehicle.engineNumber}</span>
              <button onClick={()=>setSelectedId(vehicle.id)} className="text-[12px] text-blue-600 font-semibold hover:underline">View full telemetry</button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="aspect-video rounded-xl overflow-hidden border border-slate-200">
                <img src={vehicle.image} alt="" className="w-full h-full object-cover"/>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
                <div className="rounded-md bg-slate-50 border border-slate-200 px-2 py-1.5">
                  <div className="text-slate-500">Fuel Type</div>
                  <div className="font-semibold text-slate-800 text-xs mt-0.5">{vehicle.fuelType}</div>
                </div>
                <div className="rounded-md bg-slate-50 border border-slate-200 px-2 py-1.5">
                  <div className="text-slate-500">Odometer</div>
                  <div className="font-semibold text-slate-800 text-xs mt-0.5 tabular-nums">{Math.round(vehicle.odometer).toLocaleString()} km</div>
                </div>
                <div className="rounded-md bg-slate-50 border border-slate-200 px-2 py-1.5 col-span-2">
                  <div className="text-slate-500">Engine Serial Number</div>
                  <div className="font-mono font-semibold text-slate-900 text-xs mt-0.5">{vehicle.engineNumber}</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-3 gap-2">
              <Gauge2 label="SPEED" value={vehicle.speed} max={160} unit=" km/h" color="#2563eb" size={130}/>
              <Gauge2 label="FUEL"  value={vehicle.fuel}  max={100} unit="%" color="#f59e0b" size={130}/>
              <Gauge2 label="BATT"  value={vehicle.battery} max={100} unit="%" color="#10b981" size={130}/>
              <Gauge2 label="RPM"   value={vehicle.engineRpm/1000} max={5} unit="k" color="#8b5cf6" size={130}/>
              <Gauge2 label="TEMP"  value={vehicle.temperature} max={120} unit="°" color="#ef4444" size={130}/>
              <Gauge2 label="SIGNAL" value={vehicle.gsmSignal} max={100} unit="%" color="#0ea5e9" size={130}/>
            </div>
          </div>
        </SectionCard>

        {/* Dynamic / Added Telemetry Parameters */}
        <SectionCard 
          title="Dynamic Operations Telemetry (Live)" 
          subtitle="Real-time sensor feeds configured by operations admin"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {vehicle.customParams && Object.entries(vehicle.customParams).map(([key, cfg]) => (
              <div key={key} className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold">{cfg.category || 'General'}</span>
                    <h5 className="text-xs font-bold text-slate-800 leading-tight mt-0.5">{cfg.label}</h5>
                  </div>
                  <span className="text-lg font-bold text-slate-900 tabular-nums">
                    {cfg.value}
                    <span className="text-xs text-slate-500 font-normal ml-0.5">{cfg.unit}</span>
                  </span>
                </div>
                <div className="h-10 w-full mt-2">
                  <MiniArea data={cfg.history || [cfg.value]} color="#0ea5e9" height={40}/>
                </div>
              </div>
            ))}
            {(!vehicle.customParams || Object.keys(vehicle.customParams).length === 0) && (
              <div className="col-span-full py-6 text-center text-xs text-slate-500">
                No custom parameters defined. Admin can add them in the Telemetry section.
              </div>
            )}
          </div>
        </SectionCard>

        {/* Maps & Routes */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          <div className="xl:col-span-2">
            <SectionCard title="Assigned Route" subtitle={route ? route.name : "No Assigned Route"} pad={false}>
              <div className="p-3"><FleetMap height="h-[420px]" showRoutes={true}/></div>
            </SectionCard>
          </div>
          <SectionCard title="Trip & Uplink Information" subtitle="Dual Fallback active">
            <div className="space-y-2">
              <StatBar label="Progress" value={route ? Math.round(vehicle.routeProgress) : 0} color="#2563eb" unit="%"/>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[12px]">
                {[
                  [MapPin,    'Current Stop', route ? route.stops[vehicle.currentStopIdx] : '—'],
                  [Navigation,'Next Stop',    route ? route.stops[Math.min(route.stops.length-1,vehicle.currentStopIdx+1)] : '—'],
                  [RouteIcon, 'Destination',  route ? route.stops[route.stops.length-1] : '—'],
                  [Timer,     'ETA',          route ? `${vehicle.etaMin} min` : '—'],
                  [Signal,    'Network type', vehicle.networkType],
                  [Satellite, 'Sat link',     vehicle.satelliteLink],
                ].map(([Ic,k,val],i)=>(
                  <div key={i} className="rounded-lg bg-slate-50 border border-slate-200 p-2">
                    <div className="text-[10px] text-slate-500 flex items-center gap-1"><Ic className="h-3 w-3"/>{k}</div>
                    <div className="font-semibold text-slate-900 text-[12px] truncate">{val}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div><div className="text-[10px] text-slate-500 mb-1">Speed history</div><MiniArea data={vehicle.history.speed} color="#2563eb" height={54}/></div>
                <div><div className="text-[10px] text-slate-500 mb-1">Fuel history</div><MiniArea data={vehicle.history.fuel} color="#f59e0b" height={54}/></div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Simulation Controls (Presenter Demo Panel) */}
        {vehicle && (
          <SectionCard 
            title="⚠️ Simulation Controls (Presenter Demo Panel)" 
            subtitle="Simulate real-time vehicle faults on this device to test operations warning systems & live dispatches in the Admin Console."
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <button 
                onClick={() => triggerTelemetryAnomaly(vehicle.id, 'temperature', 118.5, `Engine overheating critical on ${vehicle.id} (118.5°C) — Emergency stop advised`)}
                className="py-2.5 px-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold transition flex items-center justify-center gap-1.5"
              >
                🔥 Overheat Engine
              </button>
              <button 
                onClick={() => triggerTelemetryAnomaly(vehicle.id, 'coolant', 109.0, `Coolant temp critical on ${vehicle.id} (109.0°C) — Check radiator level`)}
                className="py-2.5 px-3 rounded-lg border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 font-bold transition flex items-center justify-center gap-1.5"
              >
                💧 Radiator Leak
              </button>
              <button 
                onClick={() => triggerTelemetryAnomaly(vehicle.id, 'battery', 8.2, `Critical battery low on ${vehicle.id} (8.2%) — Alternator belt failure suspected`)}
                className="py-2.5 px-3 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold transition flex items-center justify-center gap-1.5"
              >
                ⚡ Battery Depletion
              </button>
              <button 
                onClick={() => triggerAlert(vehicle.id, 'crash', 'critical', `🚨 CRITICAL G-SENSOR: Collision impact detected on vehicle ${vehicle.id} (4.6G Impact)`)}
                className="py-2.5 px-3 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-bold transition flex items-center justify-center gap-1.5"
              >
                ⚠️ G-Sensor Collision
              </button>
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
