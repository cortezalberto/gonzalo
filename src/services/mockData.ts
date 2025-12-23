import type { Restaurant, Category, Subcategory, Product } from '../types'

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
  { id: '1', name: 'categories.food', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop', order: 1 },
  { id: '2', name: 'categories.drinks', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=400&fit=crop', order: 2 },
  { id: '3', name: 'categories.desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop', order: 3 }
]

// Subcategories with translation keys
export const mockSubcategories: Subcategory[] = [
  // Food subcategories (category_id: '1')
  { id: 'sub-1', name: 'subcategories.burgers', category_id: '1', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop', order: 1 },
  { id: 'sub-2', name: 'subcategories.pasta', category_id: '1', image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop', order: 2 },
  { id: 'sub-3', name: 'subcategories.salads', category_id: '1', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop', order: 3 },
  { id: 'sub-4', name: 'subcategories.seafood', category_id: '1', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop', order: 4 },
  { id: 'sub-5', name: 'subcategories.appetizers', category_id: '1', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop', order: 5 },

  // Drinks subcategories (category_id: '2')
  { id: 'sub-6', name: 'subcategories.beer', category_id: '2', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop', order: 1 },
  { id: 'sub-7', name: 'subcategories.cocktails', category_id: '2', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=400&fit=crop', order: 2 },
  { id: 'sub-8', name: 'subcategories.softDrinks', category_id: '2', image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop', order: 3 },
  { id: 'sub-9', name: 'subcategories.wine', category_id: '2', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop', order: 4 },

  // Desserts subcategories (category_id: '3')
  { id: 'sub-10', name: 'subcategories.cakes', category_id: '3', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', order: 1 },
  { id: 'sub-11', name: 'subcategories.iceCream', category_id: '3', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop', order: 2 },
  { id: 'sub-12', name: 'subcategories.fruits', category_id: '3', image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=400&fit=crop', order: 3 }
]

export const mockProducts: Product[] = [
  // Appetizers (sub-5)
  {
    id: '1',
    name: 'Tofu Frito',
    description: 'Cebolla con queso fundido',
    price: 12.50,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=400&fit=crop',
    category_id: '1',
    subcategory_id: 'sub-5',
    featured: true,
    popular: true,
    badge: 'TEX MEX'
  },
  // Pasta (sub-2)
  {
    id: '2',
    name: 'Risotto de Hongos',
    description: 'Parmesano con hierbas frescas',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop',
    category_id: '1',
    subcategory_id: 'sub-2',
    featured: true,
    popular: true,
    badge: null
  },
  // Burgers (sub-1)
  {
    id: '3',
    name: 'Hamburguesa Clásica',
    description: 'Medallón de carne con salsa especial',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop',
    category_id: '1',
    subcategory_id: 'sub-1',
    featured: true,
    popular: true,
    badge: null
  },
  // Salads (sub-3)
  {
    id: '4',
    name: 'Bowl Veggie',
    description: 'Vegetales frescos y quinoa',
    price: 14.00,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
    category_id: '1',
    subcategory_id: 'sub-3',
    featured: false,
    popular: true,
    badge: 'VEGANO'
  },
  // Seafood (sub-4)
  {
    id: '5',
    name: 'Salmón a la Parrilla',
    description: 'Con salsa de limón y manteca',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=400&fit=crop',
    category_id: '1',
    subcategory_id: 'sub-4',
    featured: true,
    popular: false,
    badge: null
  },
  // Pasta (sub-2)
  {
    id: '6',
    name: 'Pasta Carbonara',
    description: 'Pasta cremosa con panceta',
    price: 16.00,
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=400&fit=crop',
    category_id: '1',
    subcategory_id: 'sub-2',
    featured: false,
    popular: true,
    badge: null
  },
  // Beer (sub-6)
  {
    id: '7',
    name: 'Cerveza Artesanal',
    description: 'Selección de IPA local',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=400&fit=crop',
    category_id: '2',
    subcategory_id: 'sub-6',
    featured: false,
    popular: true,
    badge: null
  },
  // Soft Drinks (sub-8)
  {
    id: '8',
    name: 'Limonada Fresca',
    description: 'Casera con menta',
    price: 5.00,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop',
    category_id: '2',
    subcategory_id: 'sub-8',
    featured: false,
    popular: true,
    badge: null
  },
  // Cakes (sub-10)
  {
    id: '9',
    name: 'Torta de Chocolate',
    description: 'Chocolate negro intenso',
    price: 9.00,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
    category_id: '3',
    subcategory_id: 'sub-10',
    featured: true,
    popular: true,
    badge: null
  },
  // Ice Cream (sub-11)
  {
    id: '10',
    name: 'Helado',
    description: 'Selección de tres bochas',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop',
    category_id: '3',
    subcategory_id: 'sub-11',
    featured: false,
    popular: true,
    badge: null
  },
  // Additional products for variety
  // Burgers (sub-1)
  {
    id: '11',
    name: 'Hamburguesa BBQ',
    description: 'Con bacon y salsa barbacoa',
    price: 17.00,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=400&fit=crop',
    category_id: '1',
    subcategory_id: 'sub-1',
    featured: false,
    popular: true,
    badge: 'BBQ'
  },
  // Cocktails (sub-7)
  {
    id: '12',
    name: 'Mojito Clásico',
    description: 'Ron, menta, lima y soda',
    price: 10.00,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&h=400&fit=crop',
    category_id: '2',
    subcategory_id: 'sub-7',
    featured: true,
    popular: true,
    badge: null
  },
  // Wine (sub-9)
  {
    id: '13',
    name: 'Vino Tinto Reserva',
    description: 'Malbec argentino',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop',
    category_id: '2',
    subcategory_id: 'sub-9',
    featured: false,
    popular: false,
    badge: null
  },
  // Fruits (sub-12)
  {
    id: '14',
    name: 'Ensalada de Frutas',
    description: 'Frutas frescas de estación',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=400&fit=crop',
    category_id: '3',
    subcategory_id: 'sub-12',
    featured: false,
    popular: true,
    badge: 'SALUDABLE'
  }
]

// Helper functions
export const getFeaturedProducts = (): Product[] => mockProducts.filter(p => p.featured)
export const getPopularProducts = (): Product[] => mockProducts.filter(p => p.popular)
export const getProductsByCategory = (categoryId: string): Product[] => mockProducts.filter(p => p.category_id === categoryId)
export const getProductsBySubcategory = (subcategoryId: string): Product[] => mockProducts.filter(p => p.subcategory_id === subcategoryId)
export const getSubcategoriesByCategory = (categoryId: string): Subcategory[] => mockSubcategories.filter(s => s.category_id === categoryId).sort((a, b) => a.order - b.order)
export const getProductById = (id: string): Product | undefined => mockProducts.find(p => p.id === id)
export const getCategoryById = (id: string): Category | undefined => mockCategories.find(c => c.id === id)
export const getSubcategoryById = (id: string): Subcategory | undefined => mockSubcategories.find(s => s.id === id)
export const getRecommendedProducts = (): Product[] => mockProducts.filter(p => p.popular).slice(0, 4)
