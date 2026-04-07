import { useState } from 'react';
import { Link } from 'react-router';
import { Calendar, Clock, User, ArrowRight, Search, Filter, Leaf, Sprout, TreePine } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Guía Completa para Cultivar Hierbas Aromáticas en Casa',
    excerpt: 'Descubre cómo crear tu propio jardín de hierbas aromáticas con consejos expertos y técnicas fáciles para principiantes.',
    content: `
      <h2>¿Por qué cultivar hierbas aromáticas en casa?</h2>
      <p>Cultivar hierbas aromáticas en casa es una excelente manera de tener siempre a mano ingredientes frescos para tus comidas, además de aromatizar tu hogar con fragancias naturales. Las hierbas como albahaca, menta, romero y tomillo son perfectas para cultivar en macetas, ya que no requieren mucho espacio ni cuidados complicados.</p>
      
      <h3>Beneficios de tener tu propio jardín de hierbas</h3>
      <ul>
        <li>Ahorro económico en compras de supermercado</li>
        <li>Ingredientes siempre frescos y orgánicos</li>
        <li>Aromas naturales que purifican el ambiente</li>
        <li>Actividad terapéutica y relajante</li>
      </ul>
      
      <h3>Las mejores hierbas para empezar</h3>
      <p>Recomendamos comenzar con hierbas resistentes y fáciles de cuidar:</p>
      <ul>
        <li><strong>Albahaca:</strong> Perfecta para platos italianos</li>
        <li><strong>Menta:</strong> Ideal para tés y bebidas refrescantes</li>
        <li><strong>Romero:</strong> Excelente para carnes y asados</li>
        <li><strong>Tomillo:</strong> Versátil para múltiples recetas</li>
      </ul>
      
      <h3>Consejos prácticos</h3>
      <p>1. <strong>Ubicación:</strong> Coloca tus macetas en un lugar que reciba al menos 6 horas de sol directo.</p>
      <p>2. <strong>Riego:</strong> Mantén el suelo húmedo pero no encharcado. La mayoría de las hierbas prefieren sequía entre riegos.</p>
      <p>3. <strong>Poda:</strong> Recorta regularmente para promover un crecimiento más denso y saludable.</p>
      
      <h3>Calendario de cultivo</h3>
      <p><strong>Primavera:</strong> Siembra de albahaca, menta y perejil.</p>
      <p><strong>Verano:</strong> Cosecha regular y poda de mantenimiento.</p>
      <p><strong>Otoño:</strong> Preparación para el invierno y cosecha final.</p>
      <p><strong>Invierno:</strong> Protección de plantas sensibles y cultivo interior.</p>
    `,
    author: 'María González',
    date: '2024-03-15',
    readTime: '8 min',
    category: 'Cultivo',
    image: 'https://images.unsplash.com/photo-1598486945409-78be1399c366?auto=format&fit=crop&q=80&w=600',
    featured: true,
    slug: 'guia-hierbas-aromaticas-casa'
  },
  {
    id: '2',
    title: 'Jardines Verticales: La Solución para Espacios Pequeños',
    excerpt: 'Transforma paredes vacías en jardines verticales productivos y decorativos con estas técnicas innovadoras.',
    content: `
      <h2>¿Qué es un jardín vertical?</h2>
      <p>Un jardín vertical es una técnica de cultivo que aprovecha las paredes y estructuras verticales para crear espacios verdes en áreas con poco suelo disponible. Es perfecto para balcones, terrazas pequeñas o incluso paredes interiores.</p>
      
      <h3>Ventajas de los jardines verticales</h3>
      <ul>
        <li>Aprovechamiento máximo del espacio disponible</li>
        <li>Mejora del aislamiento térmico y acústico</li>
        <li>Creación de microclimas más frescos</li>
        <li>Estética moderna y decorativa</li>
      </ul>
      
      <h3>Sistemas populares</h3>
      <p>Existen varios sistemas para crear jardines verticales:</p>
      <ul>
        <li><strong>Bolsas de cultivo:</strong> Bolsas con múltiples compartimentos</li>
        <li><strong>Estructuras modulares:</strong> Paneles intercambiables</li>
        <li><strong>Macetas apilables:</strong> Sistema vertical con macetas individuales</li>
        <li><strong>Hidroponía vertical:</strong> Cultivo sin suelo optimizado</li>
      </ul>
    `,
    author: 'Carlos Rodríguez',
    date: '2024-03-10',
    readTime: '6 min',
    category: 'Diseño',
    image: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&q=80&w=600',
    featured: true,
    slug: 'jardines-verticales-espacios-pequenos'
  },
  {
    id: '3',
    title: 'El Arte del Compostaje: Transforma Desperdicios en Oro Negro',
    excerpt: 'Aprende a crear tu propio compost casero y reduce tu huella ecológica mientras fertilizas tu jardín.',
    content: `
      <h2>¿Por qué hacer compost?</h2>
      <p>El compostaje es el proceso natural de descomposición de materia orgánica que convierte residuos de cocina y jardín en un fertilizante rico y nutritivo. Es una práctica ecológica que reduce la cantidad de basura que va a los vertederos mientras mejora la salud de tu suelo.</p>
      
      <h3>Beneficios del compostaje casero</h3>
      <ul>
        <li>Reducción de residuos orgánicos hasta en un 40%</li>
        <li>Ahorro en fertilizantes comerciales</li>
        <li>Mejora de la estructura del suelo</li>
        <li>Aumento de la retención de agua</li>
      </ul>
      
      <h3>Qué puedes compostar</h3>
      <p><strong>Materiales verdes (ricos en nitrógeno):</strong></p>
      <ul>
        <li>Restos de frutas y verduras</li>
        <li>Posos de café y filtros de papel</li>
        <li>Restos de césped fresco</li>
      </ul>
      
      <p><strong>Materiales marrones (ricos en carbono):</strong></p>
      <ul>
        <li>Hojas secas y ramas pequeñas</li>
        <li>Cartón sin imprimir (trozado)</li>
        <li>Paja y aserrín</li>
      </ul>
    `,
    author: 'Ana Martínez',
    date: '2024-03-05',
    readTime: '10 min',
    category: 'Sostenibilidad',
    image: 'https://images.unsplash.com/photo-1585859668131-9150114940b3?auto=format&fit=crop&q=80&w=600',
    featured: false,
    slug: 'arte-compostaje-casero'
  },
  {
    id: '4',
    title: 'Plantas que Purifican el Aire: Tu Pulmones Naturales',
    excerpt: 'Descubre las mejores plantas para mejorar la calidad del aire en tu hogar de forma natural y decorativa.',
    content: `
      <h2>La importancia de la calidad del aire interior</h2>
      <p>El aire interior puede ser hasta 5 veces más contaminado que el exterior debido a productos químicos, muebles y falta de ventilación. Las plantas son una solución natural y efectiva para purificar el aire mientras añaden belleza a tu hogar.</p>
      
      <h3>Las mejores plantas purificadoras</h3>
      <ul>
        <li><strong>Lengua de suegra (Sansevieria):</strong> Elimina formaldehído y benceno</li>
        <li><strong>Poto (Epipremnum aureum):</strong> Combate monóxido de carbono</li>
        <li><strong>Helecho de Boston (Nephrolepis):</strong> Absorbe xileno y tolueno</li>
        <li><strong>Aloe vera:</strong> Filtra formaldehído y benceno</li>
        <li><strong>Ficus:</strong> Excelente para eliminar compuestos orgánicos volátiles</li>
      </ul>
      
      <h3>Cantidad recomendada por habitación</h3>
      <p>Los expertos recomiendan:</p>
      <ul>
        <li>1 planta grande por cada 10m²</li>
        <li>2-3 plantas medianas por habitación</li>
        <li>Variedad de especies para mejor cobertura</li>
      </ul>
    `,
    author: 'Laura Silva',
    date: '2024-02-28',
    readTime: '7 min',
    category: 'Plantas',
    image: 'https://images.unsplash.com/photo-14168795395840e-1f3f5e4eeae?auto=format&fit=crop&q=80&w=600',
    featured: false,
    slug: 'plantas-purifican-aire-natural'
  },
  {
    id: '5',
    title: 'Riego Automático: Guía para Principiantes',
    excerpt: 'Instala tu propio sistema de riego automático y mantén tus plantas perfectamente hidratadas sin esfuerzo.',
    content: `
      <h2>¿Por qué instalar riego automático?</h2>
      <p>El riego automático es una solución tecnológica que proporciona la cantidad exacta de agua que tus plantas necesitan, cuando lo necesitan. Es perfecto para personas con poco tiempo, para vacaciones o simplemente para asegurar un crecimiento óptimo de las plantas.</p>
      
      <h3>Tipos de sistemas de riego</h3>
      <ul>
        <li><strong>Riego por goteo:</strong> El más eficiente, entrega agua directamente a las raíces</li>
        <li><strong>Riego por microaspersión:</strong> Ideal para plantas que prefieren humedad foliar</li>
        <li><strong>Riego subterráneo:</strong> Minimiza la evaporación del agua</li>
      </ul>
      
      <h3>Componentes básicos</h3>
      <ul>
        <li>Programador de riego (timer)</li>
        <li>Tubos y conectores</li>
        <li>Emisores de agua (goteros o aspersores)</li>
        <li>Filtros y reguladores de presión</li>
      </ul>
    `,
    author: 'Roberto Díaz',
    date: '2024-02-20',
    readTime: '9 min',
    category: 'Tecnología',
    image: 'https://images.unsplash.com/photo-1558905748-062e3893608c?auto=format&fit=crop&q=80&w=600',
    featured: false,
    slug: 'riego-automatico-guia-principiantes'
  }
];

const categories = ['Todos', 'Cultivo', 'Diseño', 'Sostenibilidad', 'Plantas', 'Tecnología'];

export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4e6] to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Sprout className="h-16 w-16 text-[#2D5128]" />
              <Leaf className="h-8 w-8 text-[#2D5128] absolute -bottom-2 -right-2" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog Jardín Verde
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Consejos expertos, guías prácticas e inspiración para transformar tu espacio en un paraíso verde
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128]"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-[#2D5128] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {selectedCategory === 'Todos' && searchTerm === '' && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <TreePine className="h-8 w-8 text-[#2D5128]" />
              Artículos Destacados
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {featuredPosts.map(post => (
                <article key={post.id} className="group">
                  <Link to={`/blog/${post.slug}`} className="block">
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#2D5128] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#2D5128] rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{post.author}</span>
                          </div>
                          <span className="bg-[#f0f4e6] text-[#2D5128] px-3 py-1 rounded-full text-sm font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            {selectedCategory === 'Todos' && searchTerm === '' ? 'Todos los Artículos' : 'Resultados de Búsqueda'}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map(post => (
              <article key={post.id} className="group">
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2D5128] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="bg-[#f0f4e6] text-[#2D5128] px-3 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                        <ArrowRight className="h-4 w-4 text-[#2D5128] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Leaf className="h-16 w-16 text-[#2D5128]/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No encontramos artículos
              </h3>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda o explora todas nuestras categorías.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
