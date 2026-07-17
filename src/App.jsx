'use client';
import { FleetProvider, useFleet } from '@/lib/fleet/store';
import Login from '@/components/fleet/Login';
import AdminShell from '@/components/fleet/AdminShell';
import DriverView from '@/components/fleet/DriverView';
import VehicleDrawer from '@/components/fleet/VehicleDrawer';

function Root() {
  const { session } = useFleet();
  if (!session) return <Login />;
  return (
    <>
      {session.role === 'admin' ? <AdminShell /> : <DriverView />}
      <VehicleDrawer />
    </>
  );
}

export default function App() {
  return (
    <FleetProvider>
      <Root />
    </FleetProvider>
  );
}
