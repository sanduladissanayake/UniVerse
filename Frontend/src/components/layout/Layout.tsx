import { Outlet } from 'react-router-dom';
import { Navigation } from './Navigation';

export function Layout() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
}