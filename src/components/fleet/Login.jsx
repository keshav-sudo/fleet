'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Radar, ShieldCheck, Satellite, Radio, Activity, Truck, MapPinned, Cpu } from 'lucide-react';
import { useFleet } from '@/lib/fleet/store';

const FeatureLine = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-cyan-300">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <div className="text-sm font-semibold text-white">{title}</div>
      <div className="text-xs text-white/60">{desc}</div>
    </div>
  </div>
);

export default function Login() {
  const { login, drivers, addDriver } = useFleet();
  const [tab, setTab] = useState('admin');
  const [empId, setEmpId] = useState('EMP-84210');
  const [pwd, setPwd] = useState('password');
  const [err, setErr] = useState('');

  const doLogin = (e) => {
    e.preventDefault();
    setErr('');
    if (tab === 'admin') {
      if (pwd.length < 3) return setErr('Enter your password');
      login('admin', 'admin', 'Fleet Operations Admin');
    } else {
      const d = drivers.find(x => x.empId === empId.trim());
      let targetDriver = d;
      
      if (!d) {
        // Auto-generate new driver profile on the fly if not found
        const newId = `DRV-${1000 + drivers.length + 1}`;
        const randomImg = `https://i.pravatar.cc/120?img=${Math.floor(Math.random() * 60) + 1}`;
        const autoDriver = {
          id: newId,
          empId: empId.trim(),
          name: `Driver ${empId.trim().toUpperCase()}`,
          password: pwd,
          nationality: 'Emirati',
          emiratesId: `784-1990-${Math.floor(1000000 + Math.random() * 9000000)}-0`,
          license: `DXB-DL-${Math.floor(100000 + Math.random() * 900000)}`,
          phone: `+971 50 ${Math.floor(1000000 + Math.random() * 9000000)}`,
          experience: '3 yrs',
          photo: randomImg,
          status: 'Online'
        };
        addDriver(autoDriver);
        targetDriver = autoDriver;
      } else {
        // If driver exists, check password
        const expectedPassword = d.password || 'password';
        if (pwd !== expectedPassword) {
          return setErr('Incorrect password for this driver.');
        }
      }
      
      login('driver', targetDriver.id, targetDriver.name);
    }
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-[#050a1a]">
      {/* Left promo panel */}
      <div className="hidden md:flex flex-col justify-between p-10 w-1/2 relative text-white"
        style={{background:'radial-gradient(1200px 600px at -10% -10%,rgba(37,99,235,0.35),transparent 60%),radial-gradient(900px 500px at 110% 10%,rgba(14,165,233,0.25),transparent 60%),linear-gradient(180deg,#050a1a 0%,#0a1330 100%)'}}>
        <div className="absolute inset-0 bg-grid opacity-[0.07] pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Radar className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">FleetCommand</div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Enterprise Ops · UAE</div>
          </div>
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 mb-5">
            <span className="live-dot" /> System Nominal · 128 Assets Streaming
          </div>
          <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
            Command your fleet<br/>with{' '}
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              real-time intelligence
            </span>.
          </h1>
          <p className="mt-4 text-white/60 max-w-md">
            Unified telemetry across GSM, satellite &amp; GNSS. Enterprise-grade situational awareness for operations, safety and dispatch.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-lg">
            <FeatureLine icon={Satellite}   title="Iridium + GSM Uplink"  desc="Dual-path connectivity fallback" />
            <FeatureLine icon={MapPinned}   title="Sub-meter GNSS"        desc="RTK + DGPS positioning" />
            <FeatureLine icon={Activity}    title="CANbus Telemetry"      desc="OBD-II · J1939 · CANopen" />
            <FeatureLine icon={ShieldCheck} title="SOC2 · ISO27001"       desc="Encrypted end-to-end" />
          </div>
        </div>
        <div className="relative flex items-center gap-6 text-xs text-white/40">
          <span>v4.2.1 · build 20250612</span>
          <span>© 2025 FleetCommand Systems FZ-LLC</span>
        </div>
      </div>

      {/* Right login card */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 bg-slate-50">
        <motion.div initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{duration:0.4}} className="w-full max-w-md">
          <div className="bg-white rounded-2xl card-elev-lg border border-slate-200/60 p-8">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="h-4 w-4 text-blue-600" />
              <span className="text-xs uppercase tracking-[0.18em] text-slate-500">Operator Access</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Sign in to FleetCommand</h2>
            <p className="text-sm text-slate-500 mt-1">Authenticate with your enterprise credentials.</p>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
              {['admin','driver'].map(t => (
                <button key={t} onClick={()=>setTab(t)}
                  className={`text-sm font-medium py-2 rounded-md transition ${tab===t ? 'bg-white shadow text-slate-900':'text-slate-500 hover:text-slate-700'}`}>
                  {t==='admin' ? 'Administrator' : 'Driver'}
                </button>
              ))}
            </div>

            <form onSubmit={doLogin} className="mt-5 space-y-4">
              {tab==='driver' ? (
                <div>
                  <label className="text-xs font-medium text-slate-600">Employee ID</label>
                  <input value={empId} onChange={e=>setEmpId(e.target.value)} placeholder="EMP-84210"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                </div>
              ) : (
                <div>
                  <label className="text-xs font-medium text-slate-600">Corporate Email</label>
                  <input defaultValue="admin@fleetcommand.ae"
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-slate-600">Password</label>
                <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" />
              </div>
              {err && <div className="text-xs text-red-600">{err}</div>}
              <div className="flex items-center justify-between text-xs text-slate-500">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-blue-600" /> Trust this device
                </label>
                <a className="text-blue-600 hover:underline" href="#">SSO / SAML</a>
              </div>
              <button type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 text-sm shadow-lg shadow-blue-600/25 transition">
                <Radio className="h-4 w-4" /> Secure Sign-in
              </button>
            </form>

            <div className="mt-6 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Sessions are audited &amp; encrypted (TLS 1.3, AES-256).
            </div>
          </div>
          <div className="mt-4 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Need help? ops-support@fleetcommand.ae</span>
            <span className="inline-flex items-center gap-1"><Truck className="h-3.5 w-3.5" /> 128 vehicles online</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
