'use client';
import { useEffect, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Polyline, useMap, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useFleet } from '@/lib/fleet/store';
import { ROUTES } from '@/lib/fleet/data';

// Fix default icon issue in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const statusColor = (v) => {
  if (v.status === 'Idle') return '#f59e0b';
  if (v.gsmSignal < 45) return '#ef4444';
  if (v.speed > 110) return '#dc2626';
  return '#2563eb';
};

function vehicleIcon(v, selected) {
  const color = statusColor(v);
  const sz = selected ? 46 : 36;
  const html = `
    <div class="vehicle-marker" style="transform: rotate(${v.heading}deg); width:${sz}px; height:${sz}px;">
      <svg viewBox="0 0 40 40" width="100%" height="100%">
        <defs>
          <radialGradient id="pg-${v.id}" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="20" cy="20" r="19" fill="url(#pg-${v.id})"/>
        <circle cx="20" cy="20" r="13" fill="white" stroke="${color}" stroke-width="2"/>
        <path d="M20 8 L26 22 L20 19 L14 22 Z" fill="${color}" stroke="white" stroke-width="1"/>
      </svg>
    </div>`;
  return L.divIcon({ html, className:'', iconSize:[sz,sz], iconAnchor:[sz/2,sz/2] });
}

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1]]);
  return null;
}

export default function FleetMap({ height = 'h-[560px]', showRoutes = true }) {
  const { vehicles, selectedId, setSelectedId } = useFleet();
  const selected = vehicles.find(v => v.id === selectedId);
  const center = useMemo(
    () => selected ? [selected.lat, selected.lng] : [25.05, 55.2],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected?.id]
  );

  return (
    <div className={`relative w-full ${height} rounded-2xl overflow-hidden border border-slate-200 card-elev`}>
      <MapContainer center={[25.05, 55.2]} zoom={9} scrollWheelZoom className="w-full h-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {showRoutes && ROUTES.map(r => (
          <Polyline key={r.id} positions={r.coords}
            pathOptions={{ color:'#3b82f6', weight:3, opacity:0.35, dashArray:'6,6' }} />
        ))}
        {showRoutes && ROUTES.map(r => r.coords.map((c, i) => (
          <CircleMarker key={`${r.id}-${i}`} center={c}
            radius={i===0 || i===r.coords.length-1 ? 6 : 3}
            pathOptions={{ color:'#1e3a8a', fillColor:'#93c5fd', fillOpacity:1, weight:1 }} />
        )))}
        {vehicles.map(v => (
          <Marker key={v.id} position={[v.lat, v.lng]}
            icon={vehicleIcon(v, v.id===selectedId)}
            eventHandlers={{ click: () => setSelectedId(v.id) }}>
            <Popup>
              <div className="text-xs">
                <div className="font-semibold text-slate-900">{v.id} · {v.vehicleType}</div>
                <div className="text-slate-500">{v.speed} km/h · Fuel {v.fuel}% · {v.status}</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {selected && <Recenter center={center} />}
      </MapContainer>

      <div className="absolute top-3 left-3 z-[500] glass rounded-xl px-3 py-2 text-[11px] text-slate-700 flex items-center gap-3 shadow">
        <span className="live-dot" />
        <span className="font-semibold">LIVE</span>
        <span className="h-3 w-px bg-slate-300" />
        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-blue-600 inline-block"/> Moving</span>
        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-amber-500 inline-block"/> Idle</span>
        <span className="inline-flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-red-500 inline-block"/> Alert</span>
      </div>
      <div className="absolute top-3 right-3 z-[500] glass rounded-xl px-3 py-2 text-[11px] shadow text-slate-700">
        <div className="font-semibold">GNSS · GSM · SAT</div>
        <div className="text-slate-500">{vehicles.length} assets streaming · ~2.5s cadence</div>
      </div>
    </div>
  );
}
