import { Link } from 'react-router';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="mb-4 text-6xl">404</h1>
      <h2 className="mb-6 text-3xl">Página no encontrada</h2>
      <p className="mb-8 text-gray-600">
        Lo sentimos, la página que buscas no existe.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
      >
        <Home className="h-5 w-5" />
        Volver al Inicio
      </Link>
    </div>
  );
}
