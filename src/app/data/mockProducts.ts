import { Product } from '../context/CartContext';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Maceta Cerámica',
    description: 'Maceta de cerámica artesanal con drenaje, perfecta para plantas de interior y exterior. Diseño elegante y duradero.',
    price: 18.50,
    image: '/images/maceta.png',
    category: 'Macetas',
    stock: 30,
    rating: 4.7
  },
  {
    id: 2,
    name: 'Fertilizante Líquido',
    description: 'Fertilizante concentrado para crecimiento saludable de tus plantas. Fórmula orgánica y natural.',
    price: 15.99,
    image: '/images/fertilizante.png',
    category: 'Fertilizantes',
    stock: 40,
    rating: 4.6
  },
  {
    id: 3,
    name: 'Planta Monstera Deliciosa',
    description: 'Hermosa planta tropical con hojas grandes y perforadas. Ideal para decorar interiores con estilo.',
    price: 45.99,
    image: '/images/monstera.png',
    category: 'Plantas',
    stock: 25,
    rating: 4.5
  },
  {
    id: 4,
    name: 'Tierra Orgánica Premium',
    description: 'Mezcla de tierra orgánica de alta calidad, perfecta para todo tipo de plantas y jardines.',
    price: 12.99,
    image: '/images/tierra.png',
    category: 'Sustratos',
    stock: 50,
    rating: 4.8
  },
  {
    id: 5,
    name: 'Set de Herramientas',
    description: 'Set completo de herramientas de jardinería: pala, rastrillo, tijeras de podar y regadera.',
    price: 29.99,
    image: '/images/herramientas.png',
    category: 'Herramientas',
    stock: 20,
    rating: 4.4
  },
  {
    id: 6,
    name: 'Planta Pothos',
    description: 'Planta colgante de fácil cuidado, perfecta para purificar el aire en espacios interiores.',
    price: 22.50,
    image: '/images/pothos.png',
    category: 'Plantas',
    stock: 35,
    rating: 4.6
  },
  {
    id: 7,
    name: 'Maceta de Terracota',
    description: 'Maceta tradicional de terracota con excelente drenaje. Ideal para plantas que requieren aireación.',
    price: 14.99,
    image: '/images/terracota.png',
    category: 'Macetas',
    stock: 45,
    rating: 4.3
  },
  {
    id: 8,
    name: 'Regadera Metálica',
    description: 'Regadera de metal con diseño vintage y capacidad de 2 litros. Decorativa y funcional.',
    price: 24.99,
    image: '/images/regadera.png',
    category: 'Herramientas',
    stock: 15,
    rating: 4.7
  },
  {
    id: 9,
    name: 'Planta Suculenta Mix',
    description: 'Set de 5 suculentas variadas en mini macetas. Perfectas para escritorios y espacios pequeños.',
    price: 19.99,
    image: '/images/suculentas.png',
    category: 'Plantas',
    stock: 30,
    rating: 4.5
  },
  {
    id: 10,
    name: 'Tijeras de Podar',
    description: 'Tijeras profesionales de podar con acero inoxidable y mango ergonómico.',
    price: 16.99,
    image: '/images/tijeras.png',
    category: 'Herramientas',
    stock: 25,
    rating: 4.6
  },
  {
    id: 11,
    name: 'Fertilizante Granulado',
    description: 'Fertilizante de liberación lenta para plantas de exterior. Duración de 3 meses.',
    price: 18.99,
    image: '/images/granulado.png',
    category: 'Fertilizantes',
    stock: 40,
    rating: 4.4
  },
  {
    id: 12,
    name: 'Planta Ficus Lyrata',
    description: 'Elegante planta de hojas grandes en forma de violín. Perfecta para espacios amplios.',
    price: 55.99,
    image: '/images/ficus.png',
    category: 'Plantas',
    stock: 15,
    rating: 4.8
  }
];

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(p => p.id === parseInt(id));
};

export const getProducts = (): Product[] => {
  return mockProducts;
};
