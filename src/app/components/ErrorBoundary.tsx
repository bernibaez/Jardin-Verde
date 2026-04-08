import { useRouteError, Link } from 'react-router';
import { AlertCircle } from 'lucide-react';

export function ErrorBoundary() {
  const error: any = useRouteError();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4e6] to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Oops! Algo salió mal</h1>
        <p className="text-gray-600 mb-6">
          {error?.message || "Ha ocurrido un error inesperado al cargar esta página."}
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-[#2D5128] hover:bg-[#1f3d1f] text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            Intentar de nuevo
          </button>
          <Link 
            to="/"
            className="w-full border-2 border-[#2D5128] text-[#2D5128] hover:bg-gray-50 px-6 py-3 rounded-xl font-bold transition-all"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
