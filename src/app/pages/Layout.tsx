import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MobileNavigation } from '../components/MobileNavigation';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <MobileNavigation />
    </div>
  );
}
