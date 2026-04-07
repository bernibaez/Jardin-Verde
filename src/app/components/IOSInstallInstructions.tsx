import { X, Share2, Plus } from 'lucide-react';

interface IOSInstallInstructionsProps {
  onClose: () => void;
}

export function IOSInstallInstructions({ onClose }: IOSInstallInstructionsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:hidden">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-leaf-green rounded-full flex items-center justify-center mx-auto">
            <Share2 className="h-8 w-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-dark-green">Instalar en iPhone</h3>
          
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-gray-600">1</span>
              </div>
              <p className="text-sm text-gray-700">
                Toca el botón <strong>Compartir</strong> <Share2 className="inline h-4 w-4 mx-1" /> en la parte inferior de Safari
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-gray-600">2</span>
              </div>
              <p className="text-sm text-gray-700">
                Desplázate hacia abajo y selecciona <strong>"Añadir a pantalla de inicio"</strong>
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-gray-600">3</span>
              </div>
              <p className="text-sm text-gray-700">
                Toca <strong>"Añadir"</strong> para instalar la aplicación
              </p>
            </div>
          </div>
          
          <div className="bg-soft-green rounded-xl p-3 mt-4">
            <p className="text-xs text-dark-green font-medium">
              ¡Así podrás acceder directamente al catálogo de productos sin abrir el navegador!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
