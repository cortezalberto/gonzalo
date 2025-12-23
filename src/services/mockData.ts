import type { Restaurant, Category, Product } from '../types'

// Mock data for development - barijho style
export const mockRestaurant: Restaurant = {
  id: '1',
  name: 'barijho',
  slug: 'barijho',
  description: 'Your favorite food',
  theme_color: '#f97316'
}

// Categories with translation keys
// The 'name' field is now an i18n key that should be translated in the component
export const mockCategories: Category[] = [
  { id: '0', name: 'categories.home', order: 0 },
  { id: '1', name: 'categories.food', order: 1 },
  { id: '2', name: 'categories.drinks', order: 2 },
  { id: '3', name: 'categories.desserts', order: 3 }
]

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Tofu Frito',
    description: 'Cebolla con queso fundido',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop',
    category_id: '1',
    featured: true,
    popular: true,
    badge: 'TEX MEX'
  },
  {
    id: '2',
    name: 'Risotto de Hongos',
    description: 'Parmesano con hierbas frescas',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    category_id: '1',
    featured: true,
    popular: true,
    badge: null
  },
  {
    id: '3',
    name: 'Hamburguesa Clásica',
    description: 'Medallón de carne con salsa especial',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop',
    category_id: '1',
    featured: true,
    popular: true,
    badge: null
  },
  {
    id: '4',
    name: 'Bowl Veggie',
    description: 'Vegetales frescos y quinoa',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    category_id: '1',
    featured: false,
    popular: true,
    badge: 'VEGANO'
  },
  {
    id: '5',
    name: 'Salmón a la Parrilla',
    description: 'Con salsa de limón y manteca',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
    category_id: '1',
    featured: true,
    popular: false,
    badge: null
  },
  {
    id: '6',
    name: 'Pasta Carbonara',
    description: 'Pasta cremosa con panceta',
    price: 16.00,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop',
    category_id: '1',
    featured: false,
    popular: true,
    badge: null
  },
  {
    id: '7',
    name: 'Cerveza Artesanal',
    description: 'Selección de IPA local',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop',
    category_id: '2',
    featured: false,
    popular: true,
    badge: null
  },
  {
    id: '8',
    name: 'Limonada Fresca',
    description: 'Casera con menta',
    price: 5.00,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop',
    category_id: '2',
    featured: false,
    popular: true,
    badge: null
  },
  {
    id: '9',
    name: 'Torta de Chocolate',
    description: 'Chocolate negro intenso',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
    category_id: '3',
    featured: true,
    popular: true,
    badge: null
  },
  {
    id: '10',
    name: 'Helado',
    description: 'Selección de tres bochas',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop',
    category_id: '3',
    featured: false,
    popular: true,
    badge: null
  }
]

// Helper functions
export const getFeaturedProducts = (): Product[] => mockProducts.filter(p => p.featured)
export const getPopularProducts = (): Product[] => mockProducts.filter(p => p.popular)
export const getProductsByCategory = (categoryId: string): Product[] => mockProducts.filter(p => p.category_id === categoryId)
export const getProductById = (id: string): Product | undefined => mockProducts.find(p => p.id === id)
export const getCategoryById = (id: string): Category | undefined => mockCategories.find(c => c.id === id)
export const getRecommendedProducts = (): Product[] => mockProducts.filter(p => p.popular).slice(0, 4)
