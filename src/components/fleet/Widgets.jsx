'use client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  RadialBarChart, RadialBar, PieChart, Pie, Cell
} from 'recharts';
import {
  Truck, Activity, Radio, Satellite, Fuel, HeartPulse,
  TrendingUp, TrendingDown, AlertTriangle, MapPin, Zap, Signal,
  ShieldAlert, BatteryFull, Gauge, Timer, Bell, CircleAlert,
  CheckCircle2, Info
} from 'lucide-react';
import { useFleet } from '@/lib/fleet/store';

export const KPI = ({ icon: Icon, label, value, sub, tone='blue', trend }) => {
  const tones = {
    blue:   'from-blue-500/10 to-blue-500/0 text-blue-700',
    green:  'from-emerald-500/10 to-emerald-500/0 text-emerald-700',
    amber:  'from-amber-500/10 to-amber-500/0 text-amber-700',
    red:    'from-red-500/10 to-red-500/0 text-red-700',
    slate:  'from-slate-500/10 to-slate-500/0 text-slate-700',
    violet: 'from-violet-500/10 to-violet-500/0 text-violet-700',
  };
  return (
    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white card-elev p-4">
      <div className={`absolute -top-8 -right-8 h-28 w-28 rounded-full bg-gradient-to-br ${tones[tone]}`} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">{label}</div>
          <div className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{value}</div>
          {sub && <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>}
        </div>
        <div className={`h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center ${tones[tone].split(' ').slice(-1)[0]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {trend !== undefined && (
        <div className={`relative mt-2 inline-flex items-center gap-1 text-[11px] font-medium ${trend>=0?'text-emerald-600':'text-red-600'}`}>
          {trend>=0 ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>} {Math.abs(trend)}% vs yesterday
        </div>
      )}
    </motion.div>
  );
};

export function KPICards() {
  const { kpis } = useFleet();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      <KPI icon={Truck}        label="Total Vehicles"    value={kpis.total}              sub={`${kpis.online} online · ${kpis.offline} offline`} tone="blue"   trend={2} />
      <KPI icon={Activity}     label="Moving"            value={kpis.moving}             sub={`${kpis.idle} idle`}                                tone="green"  trend={5} />
      <KPI icon={AlertTriangle} label="Emergency Alerts" value={kpis.emergencyAlerts}    sub="last 24h"                                           tone="red"    trend={-8} />
      <KPI icon={MapPin}       label="Today's Trips"    value={kpis.tripsToday}         sub="completed + active"                                 tone="violet" trend={3} />
      <KPI icon={Gauge}        label="Avg Speed"         value={`${kpis.avgSpeed} km/h`} sub="fleet-wide"                                         tone="slate"  trend={1} />
      <KPI icon={HeartPulse}   label="Fleet Health"      value={`${kpis.fleetHealth}%`}  sub={`${kpis.maintenance} due service`}                  tone="green"  trend={2} />
      <KPI icon={Signal}       label="Connectivity"      value={`${kpis.connectivity}%`} sub="GSM + SAT uplink"                                   tone="blue"   trend={0} />
      <KPI icon={Fuel}         label="Fuel Average"      value={`${kpis.fuelAvg}%`}      sub="across all tanks"                                   tone="amber"  trend={-1} />
    </div>
  );
}

export const Gauge2 = ({ value, max=100, label, unit='', color='#2563eb', size=140 }) => {
  const r = size/2 - 12;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value/max));
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} className="gauge-track" strokeWidth="10" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="10" fill="none"
          className="gauge-value" strokeDasharray={c} strokeDashoffset={c*(1-pct)} strokeLinecap="round" />
      </svg>
      <div className="flex flex-col items-center" style={{marginTop: -size*0.62}}>
        <div className="text-2xl font-bold tabular-nums text-slate-900">
          {typeof value==='number' ? value.toFixed(0) : value}
          <span className="text-xs text-slate-500 ml-0.5">{unit}</span>
        </div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
      </div>
      <div style={{height: size*0.4}} />
    </div>
  );
};

export function AlertsPanel({ compact=false }) {
  const { alerts } = useFleet();
  const iconFor = (sev) =>
    sev==='critical' ? <ShieldAlert className="h-4 w-4 text-red-600"/> :
    sev==='warning'  ? <CircleAlert className="h-4 w-4 text-amber-600"/> :
    sev==='success'  ? <CheckCircle2 className="h-4 w-4 text-emerald-600"/> :
                       <Info className="h-4 w-4 text-blue-600"/>;
  const bg = (sev) =>
    sev==='critical' ? 'bg-red-50 border-red-100' :
    sev==='warning'  ? 'bg-amber-50 border-amber-100' :
    sev==='success'  ? 'bg-emerald-50 border-emerald-100' :
                       'bg-blue-50 border-blue-100';
  return (
    <div className="rounded-2xl border border-slate-200 bg-white card-elev overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-slate-600"/>
          <span className="text-sm font-semibold text-slate-900">Live Alerts</span>
          <span className="live-dot"/>
        </div>
        <span className="text-[11px] text-slate-500">{alerts.length} events</span>
      </div>
      <div className={`overflow-y-auto ${compact?'max-h-[280px]':'flex-1'} p-2 space-y-2`}>
        <AnimatePresence initial={false}>
          {alerts.slice(0, 25).map(a => (
            <motion.div key={a.id} layout initial={{opacity:0, y:-6}} animate={{opacity:1, y:0}} exit={{opacity:0}}
              className={`rounded-lg border ${bg(a.severity)} px-3 py-2 flex items-start gap-2`}>
              <div className="mt-0.5">{iconFor(a.severity)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-slate-800 leading-snug">{a.message}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{new Date(a.ts).toLocaleTimeString()} · {a.vehicleId}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const chartData = (arr, key='v') => arr.map((v,i) => ({ i, [key]: v }));

export function MiniArea({ data, color='#2563eb', height=60 }) {
  const d = chartData(data);
  const gradId = `grad-${color.replace('#','')}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={d}>
        <defs>
          <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4}/>
            <stop offset="100%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gradId})`} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function DashboardCharts() {
  const { vehicles } = useFleet();
  const points = vehicles[0]?.history.speed.map((_, i) => {
    const avgSpeed = Math.round(vehicles.reduce((s,v)=>s+v.history.speed[i],0)/vehicles.length);
    const avgFuel  = Math.round(vehicles.reduce((s,v)=>s+v.history.fuel[i],0)/vehicles.length);
    const avgSig   = Math.round(vehicles.reduce((s,v)=>s+v.history.signal[i],0)/vehicles.length);
    return { i, speed: avgSpeed, fuel: avgFuel, signal: avgSig };
  }) || [];
  const util = [
    { name:'Utilized', value: 76, fill:'#2563eb' },
    { name:'Idle',     value: 14, fill:'#f59e0b' },
    { name:'Down',     value: 10, fill:'#ef4444' },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white card-elev p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">Fleet Telemetry · Live</div>
            <div className="text-[11px] text-slate-500">Average speed / fuel / signal across all vehicles</div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-blue-600 inline-block"/> Speed</span>
            <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-amber-500 inline-block"/> Fuel</span>
            <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-emerald-500 inline-block"/> Signal</span>
          </div>
        </div>
        <div className="h-52 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points}>
              <defs>
                <linearGradient id="sp" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4}/><stop offset="100%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="fu" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4}/><stop offset="100%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="i" tick={{fontSize:10, fill:'#94a3b8'}} />
              <YAxis tick={{fontSize:10, fill:'#94a3b8'}} />
              <Tooltip contentStyle={{fontSize:12, borderRadius:8, border:'1px solid #e2e8f0'}} />
              <Area type="monotone" dataKey="speed" stroke="#2563eb" strokeWidth={2} fill="url(#sp)" isAnimationActive={false} />
              <Area type="monotone" dataKey="fuel"  stroke="#f59e0b" strokeWidth={2} fill="url(#fu)" isAnimationActive={false} />
              <Line type="monotone" dataKey="signal" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white card-elev p-4">
        <div className="text-sm font-semibold text-slate-900">Fleet Utilization</div>
        <div className="text-[11px] text-slate-500">Rolling 24h window</div>
        <div className="h-52">
          <ResponsiveContainer>
            <RadialBarChart innerRadius="55%" outerRadius="100%" data={util} startAngle={90} endAngle={-270}>
              <RadialBar minAngle={15} dataKey="value" background clockWise cornerRadius={10} />
              <Tooltip contentStyle={{fontSize:12, borderRadius:8}} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-around text-[11px] text-slate-600">
          {util.map(u => <div key={u.name} className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full inline-block" style={{background:u.fill}}/>{u.name} {u.value}%</div>)}
        </div>
      </div>
    </div>
  );
}

export function StatBar({ label, value, max=100, color='#2563eb', unit='' }) {
  const pct = Math.min(100, (value/max)*100);
  return (
    <div>
      <div className="flex justify-between text-[11px] text-slate-500">
        <span>{label}</span>
        <span className="tabular-nums text-slate-800 font-medium">{value}{unit}</span>
      </div>
      <div className="h-1.5 mt-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{width:`${pct}%`, background:color}} />
      </div>
    </div>
  );
}

export function SectionCard({ title, subtitle, right, children, pad=true }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white card-elev overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          {subtitle && <div className="text-[11px] text-slate-500">{subtitle}</div>}
        </div>
        {right}
      </div>
      <div className={pad?'p-4':''}>{children}</div>
    </div>
  );
}
