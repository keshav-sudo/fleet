'use client';
import { useState } from 'react';
import { useFleet } from '@/lib/fleet/store';
import { ROUTES } from '@/lib/fleet/data';
import { SectionCard, StatBar, MiniArea, KPI, AlertsPanel } from './Widgets';
import {
  Truck, User, Route as RouteIcon, ClipboardList, Radio, Bell,
  BarChart3, FileText, Settings as SettingsIcon, MapPin, Fuel, Gauge,
  ChevronRight, Search, Filter, Download, Signal, Satellite, Activity, Timer, Plus, CheckCircle, ShieldAlert
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip,
  LineChart, Line, PieChart, Pie, Cell, CartesianGrid, RadialBarChart, RadialBar
} from 'recharts';
import dynamic from 'next/dynamic';
const FleetMap = dynamic(() => import('./FleetMap'), { ssr: false });

const Badge = ({ children, tone='slate' }) => {
  const tones = {
    slate:  'bg-slate-100 text-slate-700',
    blue:   'bg-blue-100 text-blue-700',
    green:  'bg-emerald-100 text-emerald-700',
    amber:  'bg-amber-100 text-amber-700',
    red:    'bg-red-100 text-red-700',
    violet: 'bg-indigo-100 text-indigo-700',
  };
  return <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${tones[tone]}`}>{children}</span>;
};

const Toolbar = ({ children }) => (
  <div className="flex flex-wrap items-center gap-2">
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] text-slate-500 w-72">
      <Search className="h-3.5 w-3.5"/>
      <input placeholder="Search…" className="bg-transparent outline-none flex-1"/>
    </div>
    <button className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[12px] inline-flex items-center gap-1.5 text-slate-700 hover:bg-slate-50">
      <Filter className="h-3.5 w-3.5"/>Filters
    </button>
    <button className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-[12px] inline-flex items-center gap-1.5 text-slate-700 hover:bg-slate-50">
      <Download className="h-3.5 w-3.5"/>Export
    </button>
    {children}
  </div>
);

export function VehiclesPage() {
  const { vehicles, setSelectedId, drivers, addVehicle } = useFleet();
  const [showAddForm, setShowAddForm] = useState(false);
  const [vehId, setVehId] = useState('');
  const [plate, setPlate] = useState('');
  const [vehicleType, setVehicleType] = useState('SUV Patrol');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('2022');
  const [fuelType, setFuelType] = useState('Petrol');
  const [engineNumber, setEngineNumber] = useState('');
  const [odometer, setOdometer] = useState('15000');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vehId || !plate || !engineNumber) return;

    // Default mock images based on type
    const defaultImages = {
      'SUV Patrol': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
      'Sedan': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      'Truck Heavy': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
      'Van Cargo': 'https://images.unsplash.com/photo-1518983808414-b81691238466?auto=format&fit=crop&w=600&q=80',
      'Bus Courier': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    };

    addVehicle({
      id: vehId.trim().toUpperCase(),
      plate: plate.trim().toUpperCase(),
      vehicleType,
      manufacturer: manufacturer.trim() || 'Toyota',
      model: model.trim() || 'Land Cruiser',
      year,
      fuelType,
      engineNumber: engineNumber.trim().toUpperCase(),
      odometer,
      image: defaultImages[vehicleType]
    });

    setSuccessMsg(`Vehicle "${vehId.toUpperCase()}" successfully added to the active fleet!`);
    setVehId('');
    setPlate('');
    setManufacturer('');
    setModel('');
    setEngineNumber('');
    
    setTimeout(() => {
      setSuccessMsg('');
      setShowAddForm(false);
    }, 4000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Vehicles</h1>
          <p className="text-[12px] text-slate-500">{vehicles.length} vehicles · realtime status</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] inline-flex items-center gap-1.5 transition font-semibold"
          >
            <Plus className="h-3.5 w-3.5"/> {showAddForm ? 'Cancel Vehicle' : 'Register New Vehicle'}
          </button>
          <Toolbar/>
        </div>
      </div>

      {/* Register Vehicle Form Card */}
      {showAddForm && (
        <SectionCard 
          title="Register New Fleet Asset" 
          subtitle="Add a new vehicle with serial numbers and initialize its smart telemetry hub."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Vehicle ID *</label>
                <input 
                  value={vehId} 
                  onChange={e => setVehId(e.target.value)}
                  placeholder="e.g. DXB-106"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 font-bold"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">License Plate *</label>
                <input 
                  value={plate} 
                  onChange={e => setPlate(e.target.value)}
                  placeholder="e.g. DXB-106100"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Vehicle Type</label>
                <select 
                  value={vehicleType} 
                  onChange={e => setVehicleType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                >
                  <option value="SUV Patrol">SUV Patrol</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Truck Heavy">Truck Heavy</option>
                  <option value="Van Cargo">Van Cargo</option>
                  <option value="Bus Courier">Bus Courier</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Manufacturer</label>
                <input 
                  value={manufacturer} 
                  onChange={e => setManufacturer(e.target.value)}
                  placeholder="e.g. Toyota / Nissan / Scania"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Model Name</label>
                <input 
                  value={model} 
                  onChange={e => setModel(e.target.value)}
                  placeholder="e.g. Land Cruiser / Patrol / R500"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Engine Serial Number *</label>
                <input 
                  value={engineNumber} 
                  onChange={e => setEngineNumber(e.target.value)}
                  placeholder="e.g. ENG-283100M"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Manufacturing Year</label>
                <input 
                  type="number"
                  value={year} 
                  onChange={e => setYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Fuel Type</label>
                <select 
                  value={fuelType} 
                  onChange={e => setFuelType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Initial Odometer (km)</label>
                <input 
                  type="number"
                  value={odometer} 
                  onChange={e => setOdometer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg text-xs transition"
              >
                Register Asset
              </button>
            </div>
          </form>
          {successMsg && (
            <div className="mt-3 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg p-3 font-semibold flex items-center gap-1.5 shadow-sm">
              <CheckCircle className="h-4 w-4 flex-shrink-0"/> {successMsg}
            </div>
          )}
        </SectionCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {vehicles.map(v => {
          const drv = drivers.find(d => d.id === v.driverId);
          return (
            <div key={v.id} onClick={()=>setSelectedId(v.id)}
              className="cursor-pointer group rounded-2xl overflow-hidden border border-slate-200 bg-white card-elev hover:card-elev-lg transition">
              <div className="h-32 bg-slate-100 relative overflow-hidden">
                <img src={v.image} alt={v.model} className="w-full h-full object-cover no-drag group-hover:scale-105 transition"/>
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <Badge tone={v.status==='Moving'?'blue':'amber'}>• {v.status}</Badge>
                  <Badge tone="slate">{v.vehicleType}</Badge>
                </div>
                <div className="absolute bottom-2 right-2 glass rounded-md px-2 py-1 text-[11px] font-mono">{v.speed} km/h</div>
              </div>
              <div className="p-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-sm font-bold text-slate-900">{v.id} <span className="text-slate-400 font-normal">· {v.plate}</span></div>
                  <div className="text-[11px] text-slate-500">{v.manufacturer} {v.model}</div>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{drv?.name || 'Unassigned'} · {v.year} · {v.fuelType}</div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <StatBar label="Fuel" value={v.fuel} color="#f59e0b" unit="%"/>
                  <StatBar label="Battery" value={v.battery} color="#10b981" unit="%"/>
                  <StatBar label="Health" value={v.drivingScore} color="#2563eb" unit="%"/>
                </div>
                <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                  <span>Odo {(Math.round(v.odometer)).toLocaleString()} km</span>
                  <span className="inline-flex items-center gap-1 text-blue-600 font-medium">Details <ChevronRight className="h-3 w-3"/></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DriversPage() {
  const { vehicles, drivers, setSelectedId, addDriver } = useFleet();
  
  // Registration Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [nationality, setNationality] = useState('Emirati');
  const [emiratesId, setEmiratesId] = useState('');
  const [license, setLicense] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('5 yrs');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !empId || !password) return;

    // Build realistic unique driver ID
    const newId = `DRV-${1000 + drivers.length + 1}`;
    
    // Choose random avatar img
    const randomAvatar = `https://i.pravatar.cc/120?img=${Math.floor(Math.random() * 60) + 1}`;

    addDriver({
      id: newId,
      empId: empId.trim(),
      name: name.trim(),
      password: password.trim(),
      nationality: nationality.trim(),
      emiratesId: emiratesId.trim() || '784-1990-0000000-0',
      license: license.trim() || 'DXB-DL-000000',
      phone: phone.trim() || '+971 50 000 0000',
      experience: experience.trim(),
      photo: randomAvatar,
      status: 'Online'
    });

    setSuccessMsg(`Driver "${name}" successfully registered! credentials: User ID (Emp ID) = "${empId}" | Pass = "${password}"`);
    
    // Reset Form
    setName('');
    setEmpId('');
    setPassword('');
    setEmiratesId('');
    setLicense('');
    setPhone('');
    
    setTimeout(() => {
      setSuccessMsg('');
      setShowAddForm(false);
    }, 6000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Drivers</h1>
          <p className="text-[12px] text-slate-500">{drivers.length} drivers registered</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] inline-flex items-center gap-1.5 transition font-semibold"
          >
            <Plus className="h-3.5 w-3.5"/> {showAddForm ? 'Cancel Registration' : 'Register New Driver'}
          </button>
          <Toolbar/>
        </div>
      </div>

      {/* Driver Registration Form Card */}
      {showAddForm && (
        <SectionCard 
          title="Register New Driver & Credentials" 
          subtitle="Add a new driver profile and generate their login username & password."
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Driver Name *</label>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Hamdan Al Maktoum"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Employee ID (Username) *</label>
                <input 
                  value={empId} 
                  onChange={e => setEmpId(e.target.value)}
                  placeholder="e.g. EMP-84220"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 font-mono"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Account Password *</label>
                <input 
                  type="password"
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create driver password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Nationality</label>
                <input 
                  value={nationality} 
                  onChange={e => setNationality(e.target.value)}
                  placeholder="e.g. Emirati"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Emirates ID</label>
                <input 
                  value={emiratesId} 
                  onChange={e => setEmiratesId(e.target.value)}
                  placeholder="784-YYYY-XXXXXXX-Z"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Driver License</label>
                <input 
                  value={license} 
                  onChange={e => setLicense(e.target.value)}
                  placeholder="e.g. DXB-DL-112233"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Phone Number</label>
                <input 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +971 50 123 4567"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Experience</label>
                <input 
                  value={experience} 
                  onChange={e => setExperience(e.target.value)}
                  placeholder="e.g. 5 yrs"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg text-xs transition"
              >
                Register Driver & Credentials
              </button>
            </div>
          </form>
          {successMsg && (
            <div className="mt-3 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg p-3 font-semibold flex items-start gap-1.5 shadow-sm">
              <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0"/> 
              <div>
                <span>{successMsg}</span>
                <p className="text-[10px] text-slate-500 mt-1 font-normal">This driver can now switch to the driver sign-in console and log in immediately using these credentials.</p>
              </div>
            </div>
          )}
        </SectionCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {drivers.map(d => {
          const veh = vehicles.find(v => v.driverId === d.id);
          const tone = d.status==='Driving'?'green':d.status==='Break'?'amber':d.status==='Online'?'blue':'slate';
          return (
            <div key={d.id} className="rounded-2xl border border-slate-200 bg-white card-elev p-4 flex gap-3">
              <img src={d.photo} alt="" className="h-16 w-16 rounded-xl object-cover border border-slate-200"/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-slate-900 truncate">{d.name}</div>
                  <Badge tone={tone}>{d.status}</Badge>
                </div>
                <div className="text-[11px] text-slate-500">{d.empId} · {d.experience}</div>
                <div className="text-[11px] text-slate-500 truncate">EID: {d.emiratesId}</div>
                <div className="text-[11px] text-slate-500">Lic: {d.license}</div>
                <div className="text-[11px] text-slate-500">Nationality: {d.nationality || 'Emirati'}</div>
                <div className="text-[11px] text-slate-500 font-mono text-blue-600 mt-0.5">Password: {d.password || 'password'}</div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <button onClick={()=>veh && setSelectedId(veh.id)} className="inline-flex items-center gap-1 text-blue-600 font-medium hover:underline">
                    <Truck className="h-3 w-3"/>{veh?.id || 'No vehicle'}
                  </button>
                  <span className="text-slate-500">{d.phone}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RoutesPage() {
  const { vehicles, drivers, assignRoute, assignVehicle } = useFleet();
  
  // State for route allocator
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [allocStatus, setAllocStatus] = useState('');

  const handleAllocation = (e) => {
    e.preventDefault();
    if (!selectedVehicle || !selectedRoute) return;
    
    // Assign route to vehicle
    assignRoute(selectedVehicle, selectedRoute);
    
    // Assign driver if selected
    if (selectedDriver) {
      assignVehicle(selectedVehicle, selectedDriver);
    }
    
    setAllocStatus('Allocation and Dispatch successfully committed!');
    setTimeout(() => setAllocStatus(''), 4000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-slate-900">Routes</h1><p className="text-[12px] text-slate-500">{ROUTES.length} active routes across the UAE</p></div>
        <Toolbar/>
      </div>

      {/* Allocation Panel */}
      <SectionCard 
        title="Dispatch & Route Allocator" 
        subtitle="Associate drivers, vehicles, and routes across the 7 Emirates"
      >
        <form onSubmit={handleAllocation} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block uppercase mb-1">1. Select Vehicle</label>
            <select 
              value={selectedVehicle} 
              onChange={e => setSelectedVehicle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            >
              <option value="">-- Choose Vehicle --</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.id} ({v.manufacturer} {v.model}) - {v.plate}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block uppercase mb-1">2. Assign Driver (Optional)</label>
            <select 
              value={selectedDriver} 
              onChange={e => setSelectedDriver(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="">-- Choose Driver --</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.empId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block uppercase mb-1">3. Select Route Corridor</label>
            <select 
              value={selectedRoute} 
              onChange={e => setSelectedRoute(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            >
              <option value="">-- Choose Route --</option>
              {ROUTES.map(r => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.emirates.join(', ')})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button 
              type="submit" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition shadow-md shadow-blue-500/20"
            >
              Commit Allocation
            </button>
          </div>
        </form>
        {allocStatus && (
          <div className="mt-3 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle className="h-4 w-4"/> {allocStatus}
          </div>
        )}
      </SectionCard>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div className="xl:col-span-2">
          <SectionCard title="Interactive Route Visualization" subtitle="All active corridors and stops" pad={false}>
            <div className="p-3"><FleetMap height="h-[560px]"/></div>
          </SectionCard>
        </div>
        <div className="space-y-3">
          {ROUTES.map((r) => {
            const onRoute = vehicles.filter(v => v.routeId === r.id);
            const progress = onRoute[0]?.routeProgress || 0;
            const eta = onRoute[0]?.etaMin || 0;
            return (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white card-elev p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{r.name}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {r.emirates && r.emirates.map(e => (
                        <Badge key={e} tone="violet">{e}</Badge>
                      ))}
                    </div>
                  </div>
                  <Badge tone="blue">{r.id}</Badge>
                </div>
                <div className="text-[11px] text-slate-500 mt-2">{r.distanceKm} km · {r.stops.length} stops · {onRoute.length} vehicle(s)</div>
                <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{width:`${progress}%`}}/>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>{Math.round(progress)}% complete</span><span>ETA {eta}m</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.stops.map((s, idx) => <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{s}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function TripsPage() {
  const { vehicles, drivers, createTrip } = useFleet();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedVehicle || !selectedDriver || !selectedRoute) return;

    createTrip(selectedVehicle, selectedDriver, selectedRoute);

    setSuccessMsg(`Trip created! Vehicle "${selectedVehicle}" and Driver are now scheduled. Driver can log in and start the trip.`);
    
    setSelectedVehicle('');
    setSelectedDriver('');
    setSelectedRoute('');

    setTimeout(() => {
      setSuccessMsg('');
      setShowCreateForm(false);
    }, 5000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Trips</h1>
          <p className="text-[12px] text-slate-500">Active, upcoming and completed trips</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] inline-flex items-center gap-1.5 transition font-semibold"
          >
            <Plus className="h-3.5 w-3.5"/> {showCreateForm ? 'Cancel Trip' : 'Create & Dispatch Trip'}
          </button>
          <Toolbar/>
        </div>
      </div>

      {/* Create Trip Form Card */}
      {showCreateForm && (
        <SectionCard 
          title="Create & Dispatch Scheduled Trip" 
          subtitle="Assign a vehicle, driver, and route corridor. The driver will see a prominent 'Start Shift' button on their laptop terminal."
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Select Vehicle *</label>
              <select 
                value={selectedVehicle}
                onChange={e => setSelectedVehicle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                required
              >
                <option value="">-- Choose Vehicle --</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.id} ({v.manufacturer} {v.model}) - {v.plate}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Assign Driver *</label>
              <select 
                value={selectedDriver}
                onChange={e => setSelectedDriver(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                required
              >
                <option value="">-- Choose Driver --</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.empId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Route Corridor *</label>
              <select 
                value={selectedRoute}
                onChange={e => setSelectedRoute(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                required
              >
                <option value="">-- Choose Route Corridor --</option>
                {ROUTES.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.emirates.join(', ')})
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg text-xs transition"
              >
                Schedule & Dispatch Trip
              </button>
            </div>
          </form>
          {successMsg && (
            <div className="mt-3 text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg p-3 font-semibold flex items-center gap-1.5 shadow-sm">
              <CheckCircle className="h-4 w-4 flex-shrink-0"/> {successMsg}
            </div>
          )}
        </SectionCard>
      )}

      <SectionCard title="Active & Scheduled Trips" subtitle="Realtime status of all dispatches" pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="bg-slate-50 text-slate-500">
              <tr>{['Trip ID','Vehicle','Driver','Route','Progress','Speed','Distance','Fuel used','ETA','Status'].map(h=><th key={h} className="text-left font-medium px-4 py-2">{h}</th>)}</tr>
            </thead>
            <tbody>
              {vehicles.map((v,i)=>{
                const drv = drivers.find(d=>d.id===v.driverId);
                const route = ROUTES.find(r=>r.id===v.routeId);
                let statusTone = 'slate';
                let statusLabel = 'Standby';
                if (v.status === 'Scheduled') {
                  statusTone = 'violet';
                  statusLabel = 'Scheduled (Ready)';
                } else if (v.status === 'Moving') {
                  statusTone = 'green';
                  statusLabel = 'In Progress';
                }
                return (
                  <tr key={v.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-2 font-mono text-slate-700">TRP-{1200+i}</td>
                    <td className="px-4 py-2 font-semibold text-slate-900">{v.id}</td>
                    <td className="px-4 py-2">{drv?.name || 'Unassigned'}</td>
                    <td className="px-4 py-2 text-slate-600">{route?.name || 'No Route'}</td>
                    <td className="px-4 py-2 w-40">
                      <div className="h-1.5 bg-slate-100 rounded-full"><div className="h-full bg-blue-600 rounded-full" style={{width:`${v.routeProgress}%`}}/></div>
                      <div className="text-[10px] text-slate-500 mt-1">{Math.round(v.routeProgress)}%</div>
                    </td>
                    <td className="px-4 py-2 tabular-nums">{v.speed} km/h</td>
                    <td className="px-4 py-2 tabular-nums">{v.distanceTravelled} km</td>
                    <td className="px-4 py-2 tabular-nums">{(v.tripOdometer*0.08).toFixed(1)} L</td>
                    <td className="px-4 py-2 tabular-nums">{v.etaMin}m</td>
                    <td className="px-4 py-2"><Badge tone={statusTone}>{statusLabel}</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

export function TelemetryPage() {
  const { vehicles, setSelectedId, customTelemetryConfigs, addCustomTelemetryConfig } = useFleet();
  
  // Custom parameter states
  const [metricName, setMetricName] = useState('');
  const [metricCategory, setMetricCategory] = useState('Engine');
  const [metricUnit, setMetricUnit] = useState('bar');
  const [metricMin, setMetricMin] = useState(0);
  const [metricMax, setMetricMax] = useState(100);
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [configSuccess, setConfigSuccess] = useState('');

  const handleAddMetric = (e) => {
    e.preventDefault();
    if (!metricName.trim()) return;

    // Create unique ID
    const id = 'custom_' + metricName.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    // Check if ID already exists
    if (customTelemetryConfigs.find(c => c.id === id)) {
      alert('A parameter with this name or identifier already exists.');
      return;
    }

    addCustomTelemetryConfig({
      id,
      label: metricName.trim(),
      category: metricCategory,
      unit: metricUnit.trim(),
      min: Number(metricMin),
      max: Number(metricMax)
    });

    setConfigSuccess(`Successfully added dynamic telemetry stream: "${metricName.trim()}"`);
    setMetricName('');
    setTimeout(() => setConfigSuccess(''), 4000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Telemetry</h1>
          <p className="text-[12px] text-slate-500">Live gauges & sensor streams from all assets</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowConfigurator(!showConfigurator)} 
            className="h-9 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[12px] inline-flex items-center gap-1.5 transition font-semibold"
          >
            <Plus className="h-3.5 w-3.5"/> {showConfigurator ? 'Hide Configurator' : 'Configure Custom Telemetry'}
          </button>
          <Toolbar/>
        </div>
      </div>

      {/* Dynamic Telemetry Configurator Form */}
      {showConfigurator && (
        <SectionCard 
          title="Telemetry Configurator (Admin Console)" 
          subtitle="Define new real-time streaming data points. These instantly reflect on the telemetry grid and driver laptop console."
        >
          <form onSubmit={handleAddMetric} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Metric/Parameter Name</label>
              <input 
                value={metricName}
                onChange={e => setMetricName(e.target.value)}
                placeholder="e.g. Tyre Pressure Front-Left, Cargo Temp"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Category</label>
              <select 
                value={metricCategory}
                onChange={e => setMetricCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="Engine">Engine</option>
                <option value="Tyres">Tyres</option>
                <option value="Cabin">Cabin</option>
                <option value="Cargo">Cargo</option>
                <option value="Safety">Safety</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Unit</label>
              <input 
                value={metricUnit}
                onChange={e => setMetricUnit(e.target.value)}
                placeholder="e.g. bar, °C, %, psi, kg"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Min Value</label>
              <input 
                type="number" 
                step="any"
                value={metricMin}
                onChange={e => setMetricMin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Max Value</label>
              <input 
                type="number" 
                step="any"
                value={metricMax}
                onChange={e => setMetricMax(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
            </div>
            <div className="md:col-span-6 flex justify-end gap-2 mt-2">
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-xs transition"
              >
                Add Dynamic Parameter
              </button>
            </div>
          </form>
          {configSuccess && (
            <div className="mt-3 text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle className="h-4 w-4"/> {configSuccess}
            </div>
          )}
        </SectionCard>
      )}

      {/* Grid of Vehicles showing default & custom parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {vehicles.map(v => (
          <div key={v.id} onClick={()=>setSelectedId(v.id)}
            className="cursor-pointer rounded-2xl border border-slate-200 bg-white card-elev p-4 hover:card-elev-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-900">{v.id}</div>
                <div className="text-[11px] text-slate-500">{v.vehicleType} · <span className="font-mono text-[10px]">ENG: {v.engineNumber}</span></div>
              </div>
              <Badge tone={v.status==='Moving'?'blue':'amber'}>{v.status}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[['Speed',v.history.speed,'#2563eb'],['Fuel',v.history.fuel,'#f59e0b'],['RPM',v.history.rpm,'#8b5cf6']].map(([l,arr,c])=>(
                <div key={l}><div className="text-[10px] text-slate-500">{l}</div><MiniArea data={arr} color={c} height={44}/></div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2 text-center">
              {[['Sat',v.satellites],['dBm',v.signalStrength],['HDOP',v.hdop],['°C',v.temperature]].map(([k,val])=>(
                <div key={k} className="rounded-md bg-slate-50 border border-slate-200 py-1">
                  <div className="text-[9px] text-slate-500">{k}</div>
                  <div className="text-[12px] font-semibold tabular-nums">{val}</div>
                </div>
              ))}
            </div>

            {/* Custom parameters render live on the card */}
            {v.customParams && Object.keys(v.customParams).length > 0 && (
              <div className="mt-3 border-t border-slate-100 pt-2">
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Dynamic Telemetry</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(v.customParams).map(([key, p]) => (
                    <div key={key} className="flex justify-between items-center text-[10px] text-slate-600 bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5">
                      <span className="truncate max-w-[90px]">{p.label}</span>
                      <span className="font-semibold text-slate-800 tabular-nums">{p.value} {p.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AlertsPage() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-slate-900">Alerts</h1><p className="text-[12px] text-slate-500">Realtime notification center</p></div>
        <Toolbar/>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div className="xl:col-span-2">
          <SectionCard title="All Events" subtitle="Auto-streaming" pad={false}>
            <div className="p-2"><AlertsPanel/></div>
          </SectionCard>
        </div>
        <div className="space-y-3">
          {[['Critical','red',3],['Warnings','amber',12],['Info','blue',34],['Success','green',22]].map(([l,t,n]) => (
            <div key={l} className="rounded-2xl border border-slate-200 bg-white card-elev p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">{l}</div>
                <Badge tone={t}>{n} today</Badge>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Rolling 24h window · auto-triaged by severity</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const { vehicles, kpis, drivers } = useFleet();
  const util = [{name:'Utilized', v:76, fill:'#2563eb'},{name:'Idle', v:14, fill:'#f59e0b'},{name:'Down', v:10, fill:'#ef4444'}];
  const fuelSeries = Array.from({length:12}, (_,i)=>({m:`M${i+1}`, l: Math.round(200+Math.sin(i)*40+i*10)}));
  const perf = drivers.slice(0,6).map(d => ({ name:d.name.split(' ')[0], score: 78 + Math.round(Math.random()*20) }));
  const active = vehicles.slice(0,6).map(v=>({name:v.id, trips: 12+Math.round(Math.random()*20)}));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-slate-900">Analytics</h1><p className="text-[12px] text-slate-500">Fleet-wide performance intelligence</p></div>
        <Toolbar/>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI icon={Gauge}    label="Distance Covered"  value="38,412 km" sub="this month"    tone="blue"   trend={6}/>
        <KPI icon={Fuel}     label="Fuel Consumption"  value="12,910 L"  sub="-4.1% MoM"    tone="amber"  trend={-4}/>
        <KPI icon={Activity} label="Fleet Utilization" value="76%"        sub="target 80%"   tone="green"  trend={2}/>
        <KPI icon={Signal}   label="Connectivity SLA"  value="99.4%"      sub="GSM + Sat"    tone="violet" trend={0}/>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <SectionCard title="Fuel Consumption Trend" subtitle="L / month">
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={fuelSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                <XAxis dataKey="m" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/>
                <Line type="monotone" dataKey="l" stroke="#2563eb" strokeWidth={2}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Driver Performance" subtitle="Top 6 drivers by score">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={perf}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                <XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/>
                <Bar dataKey="score" fill="#10b981" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Fleet Utilization" subtitle="Rolling 24h">
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={util} dataKey="v" innerRadius={40} outerRadius={70} paddingAngle={3}>
                  {util.map((u,i)=><Cell key={i} fill={u.fill}/>)}
                </Pie><Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-around text-[11px] text-slate-600 -mt-3">
            {util.map(u=><div key={u.name} className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full inline-block" style={{background:u.fill}}/>{u.name} {u.v}%</div>)}
          </div>
        </SectionCard>
        <SectionCard title="Most Active Vehicles" subtitle="Trips this month">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={active}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                <XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/>
                <Bar dataKey="trips" fill="#2563eb" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
        <SectionCard title="Vehicle Health Index" subtitle="Fleet aggregate">
          <div className="h-56">
            <ResponsiveContainer>
              <RadialBarChart innerRadius="55%" outerRadius="100%"
                data={[{name:'health', value:kpis.fleetHealth, fill:'#2563eb'}]} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={10} background/>
                <Tooltip/>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <div className="-mt-16 text-center">
            <div className="text-3xl font-bold text-slate-900">{kpis.fleetHealth}%</div>
            <div className="text-[11px] text-slate-500">healthy</div>
          </div>
          <div className="h-14"/>
        </SectionCard>
        <SectionCard title="Connectivity Statistics" subtitle="GSM & Satellite reliability">
          <div className="space-y-2 mt-1">
            <StatBar label="GSM · Etisalat" value={97} color="#2563eb" unit="%"/>
            <StatBar label="GSM · du" value={93} color="#0ea5e9" unit="%"/>
            <StatBar label="Satellite · Iridium" value={99} color="#10b981" unit="%"/>
            <StatBar label="Satellite · Thuraya" value={95} color="#8b5cf6" unit="%"/>
            <StatBar label="RTK Correction" value={82} color="#f59e0b" unit="%"/>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export function ReportsPage() {
  const rows = [
    ['R-2025-06-01','Monthly Fleet Utilization','PDF','Jun 1, 2025','Ops Ahmed','Ready'],
    ['R-2025-05-29','Driver Scorecard · Q2','XLSX','May 29, 2025','HR Team','Ready'],
    ['R-2025-05-24','Fuel Consumption Audit','PDF','May 24, 2025','Finance','Ready'],
    ['R-2025-05-18','Maintenance & Downtime','PDF','May 18, 2025','Workshop','Ready'],
    ['R-2025-05-10','Geofence Violations','CSV','May 10, 2025','Compliance','Ready'],
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-slate-900">Reports</h1><p className="text-[12px] text-slate-500">Generated & scheduled reports</p></div>
        <Toolbar/>
      </div>
      <SectionCard title="Recent Reports" subtitle="Signed & timestamped" pad={false}>
        <table className="w-full text-[12px]">
          <thead className="bg-slate-50 text-slate-500">
            <tr>{['ID','Title','Format','Generated','Owner','Status',''].map(h=><th key={h} className="text-left font-medium px-4 py-2">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r[0]} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-2 font-mono text-slate-700">{r[0]}</td>
                <td className="px-4 py-2 font-medium text-slate-900">{r[1]}</td>
                <td className="px-4 py-2">{r[2]}</td>
                <td className="px-4 py-2">{r[3]}</td>
                <td className="px-4 py-2">{r[4]}</td>
                <td className="px-4 py-2"><Badge tone="green">{r[5]}</Badge></td>
                <td className="px-4 py-2 text-blue-600 font-medium hover:underline cursor-pointer">Download</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold text-slate-900">Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SectionCard title="Organization" subtitle="Company & tenancy">
          <div className="space-y-2 text-[13px]">
            {[['Tenant','FleetCommand Systems FZ-LLC'],['Region','UAE / DXB-1'],['Environment','Production'],['Compliance','SOC2, ISO27001, GDPR']].map(([k,v])=>(
              <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium">{v}</span></div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Data Streams" subtitle="Ingestion pipelines">
          <div className="space-y-2 text-[13px]">
            {[['MQTT broker','Connected · tls1.3'],['Kafka topic','fleet.telemetry.v3'],['Cadence','2.5s'],['Retention','18 months']].map(([k,v])=>(
              <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium text-emerald-600">{v}</span></div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Notifications" subtitle="Where alerts go">
          <div className="space-y-2 text-[13px]">
            {[['SMS · Ops on-call','+971 4 xxx 22 11'],['Email digest','ops@fleetcommand.ae'],['MS Teams webhook','#fleet-ops'],['PagerDuty','P1 escalation · 5m']].map(([k,v])=>(
              <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium">{v}</span></div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Access Control" subtitle="Roles & permissions">
          <div className="space-y-2 text-[13px]">
            {[['Administrator',2],['Dispatcher',6],['Analyst',4],['Driver',84]].map(([k,v])=>(
              <div key={k} className="flex justify-between"><span className="text-slate-500">{k}</span><span className="font-medium">{v} members</span></div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
