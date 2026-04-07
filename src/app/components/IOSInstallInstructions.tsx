import { X, Share2, Plus, Download, Menu } from 'lucide-react';
import { useEffect } from 'react';

interface InstallInstructionsProps {
  onClose: () => void;
  isAndroid?: boolean;
}

export function InstallInstructions({ onClose, isAndroid = false }: InstallInstructionsProps) {
  useEffect(() => {
    console.log('InstallInstructions component mounted');
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      console.log('InstallInstructions component unmounted');
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (isAndroid) {
    return (
      <div 
        className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4"
        onClick={(e) => {
          console.log('Modal backdrop clicked');
          onClose();
        }}
      >
        <div 
          className="bg-white rounded-2xl p-6 max-w-sm w-full relative animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              console.log('Close button clicked');
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-leaf-green rounded-full flex items-center justify-center mx-auto">
              <Download className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-dark-green">Instalar en Android</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-xs text-green-800 font-medium">
                <strong>¡Buenas noticias!</strong> Android permite instalación automática
              </p>
            </div>
            
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-leaf-green text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">1</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Toca el botón <strong>"Instalar para móvil"</strong>
                  </p>
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-center">
                    <Download className="h-5 w-5 text-leaf-green mr-2" />
                    <span className="text-xs font-medium">Instalar para móvil</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-leaf-green text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">2</span>
                </div>
                <p className="text-sm text-gray-700">
                  Confirma la instalación cuando aparezca el diálogo
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-leaf-green text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold">3</span>
                </div>
                <p className="text-sm text-gray-700">
                  ¡Listo! La app se instalará automáticamente en tu dispositivo
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-3 mt-4">
              <p className="text-xs text-gray-700 font-medium">
                <strong>Alternativa manual:</strong> Menú (3 puntos) &gt; "Instalar aplicación"
              </p>
            </div>
            
            <div className="bg-soft-green rounded-xl p-3">
              <p className="text-xs text-dark-green font-medium">
                ¡Disfruta de acceso rápido al catálogo desde tu pantalla de inicio!
              </p>
            </div>
            
            <button
              onClick={() => {
                console.log('Entendido button clicked');
                onClose();
              }}
              className="w-full py-3 bg-leaf-green text-white rounded-xl font-bold hover:bg-dark-green transition-colors mt-4"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // iOS Instructions
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        console.log('Modal backdrop clicked');
        onClose();
      }}
    >
      <div 
        className="bg-white rounded-2xl p-6 max-w-sm w-full relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            console.log('Close button clicked');
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
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
          
          <button
            onClick={() => {
              console.log('Entendido button clicked');
              onClose();
            }}
            className="w-full py-3 bg-leaf-green text-white rounded-xl font-bold hover:bg-dark-green transition-colors mt-4"
          >
            ¡Entendido!
          </button>
        </div>
      </div>
    </div>
  );
}
