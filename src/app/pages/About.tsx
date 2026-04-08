import { Sprout, Heart, Award, Users, Leaf, TreePine, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

export function About() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const teamMembers = [
    {
      name: "Berny Josias Baez Peña",
      id: "2023-0046",
      role: "Director Ejecutivo",
      description: "Visionario líder con pasión por la innovación en el paisajismo sostenible y la gestión ambiental."
    },
    {
      name: "David Rafael Parra Fernández",
      id: "2021-0052",
      role: "Director de Operaciones",
      description: "Experto en optimización de procesos y logística para asegurar la mejor calidad en cada entrega."
    },
    {
      name: "Sebastian A. Ponce",
      id: "2021-0220",
      role: "Arquitecto de Paisaje",
      description: "Especialista en el diseño de espacios que armonizan la estética moderna con la biodiversidad local."
    },
    {
      name: "Frank Felix de la Rosa Galva",
      id: "2021-0212",
      role: "Especialista en Horticultura",
      description: "Dedicado a la investigación y cuidado de especies exóticas y nativas para nuestros jardines."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 to-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom duration-1000">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center animate-bounce">
                <Sprout className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Sobre <span className="text-green-600">Jardín Verde</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Somos una tienda apasionada por llevar la belleza de la naturaleza a tu hogar. 
              Desde 2020, nos hemos dedicado a ofrecer las más altas quality plantas de interior 
              y el mejor servicio a nuestros clientes.
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-green-200 animate-pulse">
          <Leaf className="h-20 w-20" />
        </div>
        <div className="absolute bottom-10 right-10 text-green-200 animate-pulse delay-1000">
          <TreePine className="h-24 w-24" />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-6 animate-in fade-in slide-in-from-left duration-1000">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Nuestra Misión</h2>
              <p className="text-gray-600 leading-relaxed">
                Transformar espacios urbanos en oasis naturales proporcionando plantas de interior 
                de la más alta calidad, promoviendo el bienestar y la conexión con la naturaleza 
                en el entorno cotidiano de nuestros clientes.
              </p>
            </div>
            
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-1000 delay-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Nuestra Visión</h2>
              <p className="text-gray-600 leading-relaxed">
                Ser la tienda de plantas de interior más confiable y reconocida del país, 
                destacándonos por nuestra calidad excepcional, servicio personalizado y 
                compromiso con la sostenibilidad ambiental.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada una de nuestras acciones
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Leaf,
                title: "Calidad",
                description: "Seleccionamos cuidadosamente cada planta para garantizar la más alta calidad y salud.",
                delay: "0ms"
              },
              {
                icon: Heart,
                title: "Pasión",
                description: "Amamos lo que hacemos y nos apasiona compartir la belleza de las plantas.",
                delay: "150ms"
              },
              {
                icon: Users,
                title: "Servicio",
                description: "Ofrecemos atención personalizada y asesoramiento experto a cada cliente.",
                delay: "300ms"
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: value.delay }}
              >
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                  <value.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Clientes Felices" },
              { number: "50+", label: "Variedades de Plantas" },
              { number: "5", label: "Años de Experiencia" },
              { number: "98%", label: "Satisfacción" }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="space-y-2 animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl font-bold">{stat.number}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with Carousel */}
      <section className="py-24 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="text-green-600 font-bold uppercase tracking-widest text-sm mb-4 block">Nuestro Equipo</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Mentes Maestras Detrás de lo Verde</h2>
            <p className="text-xl text-gray-600">
              Expertos apasionados que combinan ciencia, diseño y tecnología para crear el jardín de tus sueños.
            </p>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-12">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-4 first:pl-0">
                    <div className="h-full p-8 bg-white rounded-3xl shadow-sm border border-green-50 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                      {/* Decorative Background */}
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className="w-24 h-24 bg-green-600 rounded-2xl mx-auto mb-8 flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform shadow-lg shadow-green-200">
                          <Users className="h-12 w-12 text-white" />
                        </div>
                        
                        <div className="text-center space-y-4">
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                              {member.name}
                            </h3>
                            <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                              ID: {member.id}
                            </div>
                          </div>
                          
                          <p className="text-green-600 font-semibold text-sm">
                            {member.role}
                          </p>
                          
                          <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                            {member.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button 
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all z-20 border border-green-100"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-all z-20 border border-green-100"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
            <h2 className="text-4xl font-bold text-gray-900">
              ¿Listo para transformar tu espacio?
            </h2>
            <p className="text-xl text-gray-600">
              Descubre nuestra colección de plantas premium y deja que nuestros expertos te guíen 
              en la elección perfecta para tu hogar u oficina.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-200">
                Ver Catálogo
              </button>
              <button className="border border-green-600 text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Contactar Expertos
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
