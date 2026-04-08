import { Link } from 'react-router';
import { useState } from 'react';
import { Loader2, Search, MapPin, Filter, Leaf, Users, ShoppingCart, Download } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../context/CartContext';
import { PWARedirect } from '../components/PWARedirect';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { InstallInstructions } from '../components/IOSInstallInstructions';

export function Home() {
  const { t } = useTranslation();
  const { isInstallable, install } = usePWAInstall();
  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'Maceta Cerámica',
      description: 'Maceta de cerámica artesanal con drenaje',
      price: 18.50,
      image: '/images/maceta.png',
      category: 'Macetas',
      stock: 30,
      rating: 4.7
    },
    {
      id: 2,
      name: 'Fertilizante Líquido',
      description: 'Fertilizante concentrado para crecimiento saludable',
      price: 15.99,
      image: '/images/fertilizante.png',
      category: 'Fertilizantes',
      stock: 40,
      rating: 4.6
    },
    {
      id: 3,
      name: 'Planta Monstera Deliciosa',
      description: 'Hermosa planta tropical con hojas grandes y perforadas',
      price: 45.99,
      image: '/images/monstera.png',
      category: 'Plantas',
      stock: 25,
      rating: 4.5
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleInstall = async () => {
    // Check if running on iOS or Android
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS || isAndroid) {
      setShowInstallInstructions(true);
      return;
    }
    
    const result = await install();
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
      <PWARedirect />
      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="Jardín vertical ecológico"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-white space-y-8">
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1]">
                Diseño de Paisajismo <br />
                <span className="text-leaf-green">Sostenible</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-100 max-w-xl leading-relaxed">
                Transformamos tu espacio exterior en un ecosistema vibrante y ecológico. 
                Expertos en jardines verticales, huertos urbanos y paisajismo consciente.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  to="/products"
                  className="bg-leaf-green hover:bg-white hover:text-dark-green text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg"
                >
                  Ver Catálogo
                </Link>
                <button className="flex items-center gap-2 text-white font-bold hover:text-leaf-green transition-colors px-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
                    <Search className="h-4 w-4" />
                  </div>
                  Ver Proyectos
                </button>
                {isInstallable && (
                  <button 
                    onClick={handleInstall}
                    className="bg-leaf-green hover:bg-white hover:text-dark-green text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Download className="h-4 w-4" />
                    Descargar App
                  </button>
                )}
                <Link 
                  to="/login"
                  className="bg-transparent hover:bg-white hover:text-dark-green text-white px-6 py-4 rounded-full font-bold transition-all border-2 border-white flex items-center gap-2"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>

            {/* Right Form Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-bottom duration-1000">
                <h3 className="text-2xl font-bold text-dark-green mb-6 text-center">Reserva tu Asesoría</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <input 
                      type="text" 
                      placeholder="Nombre completo" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-leaf-green/20 focus:border-leaf-green transition-all"
                    />
                  </div>
                  <div>
                    <input 
                      type="email" 
                      placeholder="Correo electrónico" 
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-leaf-green/20 focus:border-leaf-green transition-all"
                    />
                  </div>
                  <div>
                    <select className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-leaf-green/20 focus:border-leaf-green transition-all appearance-none text-gray-500">
                      <option>Tipo de servicio</option>
                      <option>Jardín Vertical</option>
                      <option>Paisajismo</option>
                      <option>Mantenimiento</option>
                    </select>
                  </div>
                  <div>
                    <textarea 
                      placeholder="Tu mensaje..." 
                      rows={3}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-leaf-green/20 focus:border-leaf-green transition-all"
                    ></textarea>
                  </div>
                  <button className="w-full py-4 bg-leaf-green hover:bg-dark-green text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-xl mt-2">
                    Enviar Solicitud
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="bg-leaf-green rounded-[2.5rem] p-10 md:p-12 text-white flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group">
              <div className="flex-1 space-y-4 relative z-10">
                <span className="text-sm font-bold uppercase tracking-widest opacity-80">Nuestros Servicios</span>
                <h3 className="text-3xl font-bold">Jardines Inteligentes</h3>
                <p className="opacity-90">Sistemas de riego automatizados y sensores de humedad para un cuidado perfecto.</p>
                <button className="text-white font-bold underline underline-offset-8 hover:text-dark-green transition-colors">Saber más</button>
              </div>
              <div className="flex-1 relative">
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-xl transform group-hover:scale-105 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=400" alt="Service 1" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-dark-green/20 rounded-full blur-2xl"></div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-dark-green rounded-[2.5rem] p-10 md:p-12 text-white flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group">
              <div className="flex-1 space-y-4 relative z-10">
                <span className="text-sm font-bold uppercase tracking-widest opacity-80">Sobre Nosotros</span>
                <h3 className="text-3xl font-bold">Pasión por lo Verde</h3>
                <p className="opacity-90">Más de 10 años creando espacios que respiran y devuelven vida a la ciudad.</p>
                <button className="text-white font-bold underline underline-offset-8 hover:text-leaf-green transition-colors">Nuestra Historia</button>
              </div>
              <div className="flex-1 relative">
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-xl transform group-hover:scale-105 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=400" alt="Service 2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products / Showcase */}
      <section className="py-24 bg-soft-green">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-dark-green mb-6">Productos Destacados</h2>
              <p className="text-lg text-gray-600">Seleccionamos cuidadosamente cada elemento para asegurar que tu jardín no solo sea bello, sino también duradero y fácil de mantener.</p>
            </div>
            <Link to="/products" className="bg-white text-dark-green px-8 py-4 rounded-full font-bold border border-gray-100 shadow-sm hover:shadow-md transition-all">
              Ver Todo
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold text-dark-green shadow-sm">
                      {product.category}
                    </span>
                  </div>
                  <button className="absolute bottom-6 right-6 w-12 h-12 bg-leaf-green text-white rounded-full flex items-center justify-center shadow-lg transform translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-8">
                  <h4 className="text-xl font-bold text-dark-green mb-2">{product.name}</h4>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-black text-leaf-green">${product.price}</span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <span className="text-sm font-bold text-gray-600 mr-1">{product.rating}</span>
                      {"★".repeat(Math.floor(product.rating))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Contact Section with split layout like image */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative flex justify-center">
              <div className="rounded-[3rem] overflow-hidden shadow-2xl relative z-10 aspect-square w-full max-w-[400px]">
                <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800" alt="Jardín Sostenible" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-soft-green rounded-full -z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-leaf-green rounded-3xl -z-0 rotate-12"></div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <span className="text-leaf-green font-bold uppercase tracking-widest text-sm">Testimonios</span>
                <h2 className="text-4xl md:text-5xl font-bold text-dark-green">Lo que dicen nuestros clientes</h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-leaf-green shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" 
                      alt="Elena Rodríguez" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-dark-green text-lg">Elena Rodríguez</p>
                    <p className="text-gray-500 text-sm">Arquitecta de Interiores</p>
                  </div>
                </div>
                <p className="text-xl text-gray-600 italic leading-relaxed bg-soft-green/30 p-6 rounded-2xl border-l-4 border-leaf-green">
                  "El equipo de Jardín Verde transformó mi balcón en un pequeño paraíso. No solo se ve increíble, sino que el sistema de riego automático me ha facilitado la vida enormemente."
                </p>
              </div>

              <div className="space-y-6 pt-10 border-t border-gray-100">
                <h3 className="text-2xl font-bold text-dark-green">Nuestras Ventajas</h3>
                <ul className="space-y-4">
                  {[
                    "Diseño personalizado para cada espacio",
                    "Materiales 100% reciclados y sostenibles",
                    "Garantía de mantenimiento por 12 meses",
                    "Expertos botánicos a tu disposición"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-gray-700 font-medium">
                      <div className="w-6 h-6 rounded-full bg-soft-green flex items-center justify-center text-leaf-green">
                        <Leaf className="h-3 w-3" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* iOS/Android Installation Instructions Modal */}
      {showInstallInstructions && (
        <InstallInstructions 
          onClose={() => setShowInstallInstructions(false)} 
          isAndroid={/Android/.test(navigator.userAgent)}
          onInstall={install}
        />
      )}
    </div>
    </>
  );
}