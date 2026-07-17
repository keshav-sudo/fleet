'use client';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Map as MapIcon, Truck, Users, Route as RouteIcon,
  ClipboardList, Radio, Bell, BarChart3, FileText, Settings as SettingsIcon,
  Radar, LogOut, Search, Bell as BellIcon, ChevronDown, HelpCircle
} from 'lucide-react';
import { useFleet } from '@/lib/fleet/store';
import { AlertsPanel, KPICards, DashboardCharts, SectionCard } from './Widgets';
import { VehiclesPage, DriversPage, RoutesPage, TripsPage, TelemetryPage, AlertsPage, AnalyticsPage, ReportsPage, SettingsPage } from './Pages';
import FleetMap from './FleetMap';

const NAV = [
  { id:'dashboard',  label:'Dashboard',  icon: LayoutDashboard },
  { id:'map',        label:'Live Map',   icon: MapIcon },
  { id:'vehicles',   label:'Vehicles',   icon: Truck },
  { id:'drivers',    label:'Drivers',    icon: Users },
  { id:'routes',     label:'Routes',     icon: RouteIcon },
  { id:'trips',      label:'Trips',      icon: ClipboardList },
  { id:'telemetry',  label:'Telemetry',  icon: Radio },
  { id:'alerts',     label:'Alerts',     icon: Bell },
  { id:'analytics',  label:'Analytics',  icon: BarChart3 },
  { id:'reports',    label:'Reports',    icon: FileText },
  { id:'settings',   label:'Settings',   icon: SettingsIcon },
];

function Sidebar() {
  const { activeView, setActiveView, kpis } = useFleet();
  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-[#0a1330] text-white h-screen sticky top-0">
      <div className="px-5 py-4 flex items-center gap-3 border-b border-white/10">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Radar className="h-5 w-5"/>
        </div>
        <div>
          <div className="text-sm font-bold">FleetCommand</div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Ops · UAE</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3">
        {NAV.map(item => {
          const active = activeView === item.id;
          return (
            <button key={item.id} onClick={()=>setActiveView(item.id)}
              className={`relative w-full flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium transition ${active?'text-white':'text-white/60 hover:text-white'}`}>
              {active && <motion.span layoutId="activeNav" className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r"/>}
              {active && <span className="absolute inset-y-1 left-2 right-2 bg-white/5 rounded-lg -z-0"/>}
              <item.icon className="h-4 w-4 relative z-10"/>
              <span className="relative z-10">{item.label}</span>
              {item.id==='alerts' && kpis.emergencyAlerts>0 && (
                <span className="relative z-10 ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-red-500">{kpis.emergencyAlerts}</span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <div className="rounded-lg bg-white/5 p-3 text-[11px] text-white/70">
          <div className="flex items-center gap-2 text-emerald-300"><span className="live-dot"/> System Nominal</div>
          <div className="mt-1 text-white/50">Uptime 99.97% · v4.2.1</div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  const { session, logout, kpis, vehicles } = useFleet();
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="h-14 px-4 md:px-6 flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[12px] text-slate-500 w-80">
            <Search className="h-3.5 w-3.5"/>
            <input placeholder="Search vehicles, drivers, routes, VIN…" className="bg-transparent outline-none flex-1" />
            <kbd className="text-[10px] rounded bg-white border border-slate-200 px-1">⌘K</kbd>
          </div>
          <div className="hidden xl:flex items-center gap-1 text-[11px] text-slate-500">
            <span className="live-dot"/> Realtime uplink · {vehicles.length} assets · {kpis.connectivity}% GSM
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600">
            <HelpCircle className="h-4 w-4"/>
          </button>
          <button className="relative h-9 w-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600">
            <BellIcon className="h-4 w-4"/>
            {kpis.emergencyAlerts>0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[9px] rounded-full bg-red-500 text-white flex items-center justify-center">
                {kpis.emergencyAlerts}
              </span>
            )}
          </button>
          <div className="h-9 pl-1 pr-2 rounded-lg border border-slate-200 bg-white flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-[11px] font-bold">
              {session?.name?.[0] || 'A'}
            </div>
            <div className="hidden md:block">
              <div className="text-[12px] font-semibold text-slate-900 leading-tight">{session?.name}</div>
              <div className="text-[10px] text-slate-500 leading-tight">{session?.role === 'admin' ? 'Administrator' : 'Driver'}</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400"/>
          </div>
          <button onClick={logout}
            className="h-9 px-2 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 flex items-center gap-1 text-[12px] text-slate-600">
            <LogOut className="h-3.5 w-3.5"/> Sign out
          </button>
        </div>
      </div>
      {/* Ticker */}
      <div className="h-8 border-t border-slate-100 bg-slate-50/60 overflow-hidden flex items-center">
        <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded ml-3">Ops Feed</span>
        <div className="flex-1 overflow-hidden ml-3">
          <div className="flex whitespace-nowrap ticker-track text-[11px] text-slate-600">
            {[...Array(2)].map((_,k)=>(
              <span key={k} className="pr-12 inline-flex items-center gap-8">
                <span>• DXB-101 entered <b className="text-slate-800">Route 4 · E11</b></span>
                <span>• Satellite link (Iridium NEXT) — <b className="text-emerald-600">nominal</b></span>
                <span>• AUH-405 fuel consumption trending <b className="text-emerald-600">-3.2%</b> WoW</span>
                <span>• SHJ-301 exceeded speed limit — <b className="text-red-600">128 km/h</b></span>
                <span>• Fleet health index <b className="text-blue-600">92.1</b> (target 90+)</span>
                <span>• GNSS RTK correction active on 6 vehicles</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function DashboardView() {
  return (
    <div className="space-y-3">
      <KPICards />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div className="xl:col-span-2 space-y-3">
          <SectionCard title="Live Fleet Map" subtitle="Real-time GPS positions · click a vehicle for full telemetry"
            right={<div className="inline-flex items-center gap-2 text-[11px] text-slate-500"><span className="live-dot"/>Streaming · ~2.5s</div>}
            pad={false}>
            <div className="p-3"><FleetMap height="h-[520px]" /></div>
          </SectionCard>
          <DashboardCharts />
        </div>
        <div className="xl:col-span-1"><AlertsPanel /></div>
      </div>
    </div>
  );
}

function MapView() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
      <div className="xl:col-span-3">
        <SectionCard title="Live Fleet Map · Command Grid" subtitle="GNSS · GSM · Satellite dual-path connectivity" pad={false}>
          <div className="p-3"><FleetMap height="h-[calc(100vh-220px)]"/></div>
        </SectionCard>
      </div>
      <div className="xl:col-span-1"><AlertsPanel/></div>
    </div>
  );
}

export default function AdminShell() {
  const { activeView } = useFleet();
  const view = {
    dashboard: <DashboardView/>,
    map:       <MapView/>,
    vehicles:  <VehiclesPage/>,
    drivers:   <DriversPage/>,
    routes:    <RoutesPage/>,
    trips:     <TripsPage/>,
    telemetry: <TelemetryPage/>,
    alerts:    <AlertsPage/>,
    analytics: <AnalyticsPage/>,
    reports:   <ReportsPage/>,
    settings:  <SettingsPage/>,
  }[activeView] || <DashboardView/>;

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] bg-radial-blue">
      <Sidebar/>
      <main className="flex-1 min-w-0">
        <TopBar/>
        <div className="p-3 md:p-5">{view}</div>
      </main>
    </div>
  );
}
