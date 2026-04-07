import { useParams, Link } from 'react-router';
import { Calendar, Clock, User, ArrowLeft, Heart, Share2, MessageCircle } from 'lucide-react';

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
    image: 'https://images.unsplash.com/photo-1598486945409-78be1399c366?auto=format&fit=crop&q=80&w=800',
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
      
      <h3>Plantas ideales para jardines verticales</h3>
      <ul>
        <li><strong>Hierbas aromáticas:</strong> Albahaca, menta, perejil</li>
        <li><strong>Plantas colgantes:</strong> Helechos, pothos, hiedras</li>
        <li><strong>Verduras de hoja:</strong> Lechugas, espinacas, acelgas</li>
        <li><strong>Fresas:</strong> Perfectas para sistemas verticales</li>
      </ul>
    `,
    author: 'Carlos Rodríguez',
    date: '2024-03-10',
    readTime: '6 min',
    category: 'Diseño',
    image: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&q=80&w=800',
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
      
      <h3>Consejos para un compost perfecto</h3>
      <p><strong>Equilibrio:</strong> Mantén una relación 2:1 de materiales marrones y verdes.</p>
      <p><strong>Humedad:</strong> El compost debe estar tan húmedo como una esponja escurrida.</p>
      <p><strong>Aireación:</strong> Voltea el compost cada semana para asegurar oxigenación.</p>
    `,
    author: 'Ana Martínez',
    date: '2024-03-05',
    readTime: '10 min',
    category: 'Sostenibilidad',
    image: 'https://images.unsplash.com/photo-1585859668131-9150114940b3?auto=format&fit=crop&q=80&w=800',
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
      
      <h3>Cuidados especiales</h3>
      <p><strong>Limpieza:</strong> Limpia las hojas regularmente con un paño húmedo.</p>
      <p><strong>Riego:</strong> No riegues en exceso, la mayoría prefieren sequía entre riegos.</p>
      <p><strong>Ubicación:</strong> Evita corrientes de aire directo y temperaturas extremas.</p>
    `,
    author: 'Laura Silva',
    date: '2024-02-28',
    readTime: '7 min',
    category: 'Plantas',
    image: 'https://images.unsplash.com/photo-14168795395840e-1f3f5e4eeae?auto=format&fit=crop&q=80&w=800',
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
      
      <h3>Instalación paso a paso</h3>
      <p><strong>1. Planificación:</strong> Dibuja un esquema de tu jardín y las necesidades de cada planta.</p>
      <p><strong>2. Instalación:</strong> Coloca los tubos principales y conectores.</p>
      <p><strong>3. Emisores:</strong> Instala goteros o aspersores según las necesidades de cada planta.</p>
      <p><strong>4. Programación:</strong> Configura el timer según las necesidades de riego.</p>
    `,
    author: 'Roberto Díaz',
    date: '2024-02-20',
    readTime: '9 min',
    category: 'Tecnología',
    image: 'https://images.unsplash.com/photo-1558905748-062e3893608c?auto=format&fit=crop&q=80&w=800',
    featured: false,
    slug: 'riego-automatico-guia-principiantes'
  }
];

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  
  const post = blogPosts.find(p => p.slug === slug);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f0f4e6] to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Artículo no encontrado</h1>
          <p className="text-gray-600 mb-8">El artículo que buscas no existe o ha sido eliminado.</p>
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 bg-[#2D5128] hover:bg-[#1f3d1f] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4e6] to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            to="/blog"
            className="inline-flex items-center gap-2 text-[#2D5128] hover:text-[#1f3d1f] font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Blog
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="aspect-video overflow-hidden rounded-2xl mb-8">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex items-center justify-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#2D5128] rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium">{post.author}</span>
                </div>
                <span className="bg-[#f0f4e6] text-[#2D5128] px-4 py-2 rounded-full text-sm font-medium">
                  {post.category}
                </span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="text-gray-700 leading-relaxed"
            />
          </div>

          {/* Article Actions */}
          <div className="flex items-center justify-center gap-4 mb-16 py-8 border-y border-gray-200">
            <button className="flex items-center gap-2 text-gray-600 hover:text-[#2D5128] transition-colors">
              <Heart className="h-5 w-5" />
              <span className="font-medium">Me gusta</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-[#2D5128] transition-colors">
              <Share2 className="h-5 w-5" />
              <span className="font-medium">Compartir</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-[#2D5128] transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Comentar</span>
            </button>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Artículos Relacionados
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map(relatedPost => (
                  <article key={relatedPost.id} className="group">
                    <Link to={`/blog/${relatedPost.slug}`} className="block">
                      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#2D5128] transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="bg-[#f0f4e6] text-[#2D5128] px-3 py-1 rounded-full text-xs font-medium">
                              {relatedPost.category}
                            </span>
                            <span className="text-sm text-gray-500">
                              {relatedPost.readTime} de lectura
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
        </article>
      </div>
    </div>
  );
}
