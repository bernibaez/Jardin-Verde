import { Sprout, Heart, Award, Users, Leaf, TreePine, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';
import { Link } from 'react-router';

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
      {/* Hero Section with Parallax-like effect */}
      <section className="relative py-32 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-green-50/50 -skew-x-12 transform origin-top"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold tracking-wide uppercase">
                <Leaf className="h-4 w-4" />
                Nuestra Historia
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1]">
                Pasión por la <br />
                <span className="text-green-600">Jardinería</span> Profesional
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                En Jardín Verde, nos dedicamos a equiparte con las mejores herramientas y suministros. 
                Desde 2020, hemos transformado miles de hogares y oficinas proporcionando artículos 
                de jardinería de alta calidad para que crees tu propio oasis de paz y bienestar.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expertos en</p>
                    <p className="font-bold text-gray-900">Suministros de Jardín</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative animate-in fade-in slide-in-from-right duration-1000 delay-300">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&q=80&w=800" 
                  alt="Vivero Jardín Verde" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-green-600 rounded-full -z-0 opacity-20 blur-3xl"></div>
              <div className="absolute top-1/2 -right-8 w-16 h-16 bg-yellow-400 rounded-2xl -z-0 rotate-12 shadow-xl flex items-center justify-center">
                <Sprout className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Reimagined with modern cards */}
      <section className="py-32 bg-gray-50/50 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="group bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden border border-gray-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-[100%] transition-all group-hover:scale-110"></div>
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-green-600 rounded-3xl flex items-center justify-center text-white transform rotate-6 group-hover:rotate-12 transition-transform shadow-lg shadow-green-200">
                  <Heart className="h-10 w-10" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900">Nuestra Misión</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Equipar a cada entusiasta de lo verde con herramientas y suministros de la más alta calidad, 
                  facilitando la creación y el mantenimiento de espacios naturales que promuevan 
                  el bienestar en el entorno cotidiano.
                </p>
              </div>
            </div>
            
            <div className="group bg-dark-green p-12 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden text-white">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-tr-[100%] transition-all group-hover:scale-110"></div>
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-leaf-green rounded-3xl flex items-center justify-center text-white transform -rotate-6 group-hover:-rotate-12 transition-transform shadow-lg shadow-black/20">
                  <Award className="h-10 w-10" />
                </div>
                <h2 className="text-4xl font-bold">Nuestra Visión</h2>
                <p className="text-lg opacity-90 leading-relaxed">
                  Ser el referente nacional en la provisión de artículos de jardinería, 
                  destacándonos por nuestro catálogo innovador, asesoría técnica experta y 
                  un compromiso inquebrantable con la sostenibilidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nature/Gardening Focused Values Section */}
      <section className="py-32 bg-stone-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 rotate-45 pointer-events-none">
          <Leaf className="w-96 h-96 text-green-800" />
        </div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 opacity-[0.03] -rotate-12 pointer-events-none">
          <TreePine className="w-96 h-96 text-green-900" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center gap-4 mb-4">
               <span className="w-16 h-px bg-green-200"></span>
               <span className="text-green-700 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                 <Sprout className="w-5 h-5"/> Nuestros Pilares
               </span>
               <span className="w-16 h-px bg-green-200"></span>
            </div>
            <h2 className="text-5xl font-black text-gray-900 font-serif">Lo que nos Define</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                icon: Award,
                title: "Calidad Suprema",
                description: "Cada herramienta y producto es probado para garantizar durabilidad y eficiencia en tu jardín.",
                color: "bg-emerald-100 text-emerald-700",
                borderColor: "group-hover:border-emerald-300"
              },
              {
                icon: Heart,
                title: "Pasión Real",
                description: "Amamos la jardinería y compartimos ese conocimiento para que logres resultados profesionales.",
                color: "bg-lime-100 text-lime-700",
                borderColor: "group-hover:border-lime-300"
              },
              {
                icon: Users,
                title: "Comunidad",
                description: "Acompañamos a nuestros clientes con asesoría técnica en el uso de cada artículo.",
                color: "bg-teal-100 text-teal-700",
                borderColor: "group-hover:border-teal-300"
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className={`group p-10 bg-white rounded-t-full rounded-b-[2.5rem] border-2 border-transparent ${value.borderColor} shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-4 relative`}
              >
                {/* Top sprout decorative accent */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500">
                  <Leaf className={`w-8 h-8 ${value.color.replace('bg-', 'text-').split(' ')[0]}`} />
                </div>
                
                <div className={`w-28 h-28 mx-auto ${value.color} rounded-full flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform duration-500 shadow-inner overflow-hidden relative`}>
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-sm -translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <value.icon className="h-12 w-12 relative z-10" />
                </div>
                <div className="text-center relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Stats Section */}
      <section className="py-32 bg-dark-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-leaf-green rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {[
              { number: "10K+", label: "Clientes Satisfechos" },
              { number: "500+", label: "Artículos de Calidad" },
              { number: "5+", label: "Años de Trayectoria" },
              { number: "100%", label: "Garantía" }
            ].map((stat, index) => (
              <div key={index} className="space-y-4">
                <div className="text-6xl font-black text-white">{stat.number}</div>
                <div className="text-leaf-green font-bold uppercase tracking-widest text-sm">{stat.label}</div>
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
              ¿Listo para equipar tu jardín?
            </h2>
            <p className="text-xl text-gray-600">
              Descubre nuestra amplia gama de suministros y deja que nuestros expertos te asesoren 
              en la elección de las mejores herramientas para tu proyecto.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/products"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-200"
              >
                Ver Catálogo
              </Link>
              <button className="border border-green-600 text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Asesoría Técnica
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
