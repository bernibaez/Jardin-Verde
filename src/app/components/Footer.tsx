import { Mail, Phone, MapPin, Sprout } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-dark-green text-white pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-leaf-green rounded-full flex items-center justify-center">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Jardín Verde</span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Llevamos la naturaleza a tu puerta con diseños innovadores y compromiso ambiental. 
              Suscríbete para recibir consejos de jardinería y ofertas exclusivas.
            </p>
            <div className="bg-white/10 p-2 rounded-2xl flex gap-2 backdrop-blur-sm border border-white/10">
              <input 
                type="email" 
                placeholder="Tu email" 
                className="bg-transparent border-none focus:ring-0 px-4 py-2 flex-1 text-white placeholder:text-gray-400"
              />
              <button className="bg-leaf-green hover:bg-white hover:text-dark-green text-white px-6 py-2 rounded-xl font-bold transition-all">
                Unirse
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-xl font-bold">Empresa</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="/about" className="hover:text-leaf-green transition-colors">Nosotros</a></li>
                <li><a href="/projects" className="hover:text-leaf-green transition-colors">Proyectos</a></li>
                <li><a href="/contact" className="hover:text-leaf-green transition-colors">Contacto</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xl font-bold">Servicios</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#" className="hover:text-leaf-green transition-colors">Paisajismo</a></li>
                <li><a href="#" className="hover:text-leaf-green transition-colors">Jardín Vertical</a></li>
                <li><a href="#" className="hover:text-leaf-green transition-colors">Huertos</a></li>
                <li><a href="#" className="hover:text-leaf-green transition-colors">Mantenimiento</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-xl font-bold">Contacto</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-leaf-green" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-leaf-green" />
                  <span>hola@jardinverde.com</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 text-sm">
          <p>&copy; 2026 Jardín Verde. Todos los derechos reservados.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-leaf-green transition-colors">Privacidad</a>
            <a href="#" className="hover:text-leaf-green transition-colors">Términos</a>
            <a href="#" className="hover:text-leaf-green transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}