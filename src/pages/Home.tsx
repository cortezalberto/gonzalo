import { useState, useMemo, useCallback, Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { useTableStore, useSession } from '../stores/tableStore'
import { useProductTranslation } from '../hooks'
import type { Category, Product } from '../types'

// Components - eager loaded (critical path)
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import CategoryTabs from '../components/CategoryTabs'
import BottomNav from '../components/BottomNav'
import SectionErrorBoundary from '../components/ui/SectionErrorBoundary'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Components - lazy loaded (below fold / conditional)
const PromoBanner = lazy(() => import('../components/PromoBanner'))
const FeaturedCarousel = lazy(() => import('../components/FeaturedCarousel'))
const ProductCard = lazy(() => import('../components/ProductCard'))
const ProductListItem = lazy(() => import('../components/ProductListItem'))
const ProductDetailModal = lazy(() => import('../components/ProductDetailModal'))
const SharedCart = lazy(() => import('../components/SharedCart'))
const AIChat = lazy(() => import('../components/AIChat'))

// Pages - lazy loaded
const CloseTable = lazy(() => import('./CloseTable'))

// Mock data
import {
  mockCategories,
  mockProducts,
  getRecommendedProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getCategoryById
} from '../services/mockData'

// React 19: Suspense fallback component
function SectionLoader({ name }: { name: string }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-center py-8">
      <LoadingSpinner size="md" />
      <span className="sr-only">{t('home.loading', { name })}</span>
    </div>
  )
}

export default function Home() {
  const { t } = useTranslation()
  const { translateProducts } = useProductTranslation()
  const [activeCategory, setActiveCategory] = useState('0') // Default to 'Home'
  const [searchQuery, setSearchQuery] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showCloseTable, setShowCloseTable] = useState(false)
  const [showAIChat, setShowAIChat] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const addToCart = useTableStore((state) => state.addToCart)
  const session = useSession()

  // Get featured products - translated based on current language
  // translateProducts is memoized and only changes when i18n.language changes
  const featuredProducts = useMemo(
    () => translateProducts(getFeaturedProducts()),
    [translateProducts]
  )

  // Get recommended products - translated based on current language
  const recommendedProducts = useMemo(
    () => translateProducts(getRecommendedProducts()),
    [translateProducts]
  )

  // Get products by selected category - translated
  const categoryProducts = useMemo(() => {
    if (activeCategory === '0') return [] // Home doesn't show category list
    return translateProducts(getProductsByCategory(activeCategory))
  }, [activeCategory, translateProducts])

  // Get current category name
  const currentCategory = useMemo(() => getCategoryById(activeCategory), [activeCategory])

  // Check if we're showing category list view
  const isShowingCategoryList = activeCategory !== '0' && !searchQuery

  // Filter products by search - translated
  const filteredProducts = useMemo(() => {
    if (!searchQuery) {
      // Return recommended products when there's no search
      return recommendedProducts
    }

    // Translate all products first, then filter by search query
    const translatedProducts = translateProducts(mockProducts)
    const query = searchQuery.toLowerCase()
    return translatedProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    )
  }, [searchQuery, translateProducts, recommendedProducts])

  const handleCategoryClick = useCallback((category: Category) => {
    setActiveCategory(category.id)
  }, [])

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product)
  }, [])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleCartClick = useCallback(() => {
    setIsCartOpen(true)
  }, [])

  const handlePromoClick = useCallback(() => {
    // Scroll to featured section when promo clicked
    // Using id instead of translated aria-label for reliable selection
    const featuredSection = document.getElementById('featured-products')
    featuredSection?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleAddToCart = useCallback((product: Product) => {
    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }, [addToCart])

  const handleCloseTable = useCallback(() => {
    setShowCloseTable(true)
  }, [])

  const handleAIChat = useCallback(() => {
    setShowAIChat(true)
  }, [])

  const handleAIChatProductClick = useCallback((product: Product) => {
    setShowAIChat(false)
    setSelectedProduct(product)
  }, [])

  // If closing table, show that screen
  if (showCloseTable) {
    return (
      <Suspense fallback={<SectionLoader name="bill" />}>
        <CloseTable onBack={() => setShowCloseTable(false)} />
      </Suspense>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg">
      {/* React 19: Document metadata in component */}
      <title>
        {session ? t('home.pageTitle', { table: session.table_number }) : t('home.pageTitleDefault')}
      </title>
      <meta
        name="description"
        content={
          session
            ? t('home.pageDescription', { table: session.table_number })
            : t('home.pageDescriptionDefault')
        }
      />

      {/* Header */}
      <Header onCartClick={handleCartClick} />

      {/* Shared Cart Modal - lazy loaded */}
      {isCartOpen && (
        <Suspense fallback={null}>
          <SharedCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </Suspense>
      )}

      {/* Product Detail Modal - lazy loaded */}
      {selectedProduct && (
        <Suspense fallback={null}>
          <ProductDetailModal
            product={selectedProduct}
            isOpen={selectedProduct !== null}
            onClose={() => setSelectedProduct(null)}
          />
        </Suspense>
      )}

      {/* AI Chat Modal - lazy loaded */}
      {showAIChat && (
        <Suspense fallback={null}>
          <AIChat
            isOpen={showAIChat}
            onClose={() => setShowAIChat(false)}
            onProductClick={handleAIChatProductClick}
          />
        </Suspense>
      )}

      {/* Main content */}
      <main className="flex-1 pb-20 sm:pb-24">
        {/* Search Bar */}
        <SectionErrorBoundary sectionName="Búsqueda">
          <SearchBar onSearch={handleSearch} />
        </SectionErrorBoundary>

        {/* Promo Banner - only on Home */}
        {!searchQuery && !isShowingCategoryList && (
          <SectionErrorBoundary sectionName="Promoción">
            <Suspense fallback={<SectionLoader name="promoción" />}>
              <PromoBanner
                title="Happy Hour!"
                discount="50% OFF"
                buttonText={t('home.viewPromos')}
                backgroundImage="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=400&fit=crop"
                onButtonClick={handlePromoClick}
              />
            </Suspense>
          </SectionErrorBoundary>
        )}

        {/* Category Tabs */}
        <SectionErrorBoundary sectionName="Categorías">
          <CategoryTabs
            categories={mockCategories}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />
        </SectionErrorBoundary>

        {/* Featured Carousel - only on Home */}
        {!searchQuery && !isShowingCategoryList && (
          <SectionErrorBoundary sectionName="Destacados">
            <Suspense fallback={<SectionLoader name="destacados" />}>
              <FeaturedCarousel
                products={featuredProducts}
                onProductClick={handleProductClick}
              />
            </Suspense>
          </SectionErrorBoundary>
        )}

        {/* Category Products List */}
        {isShowingCategoryList && (
          <section className="px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4">
                {currentCategory?.name ? t(currentCategory.name) : t('home.products')}
              </h2>

              <SectionErrorBoundary sectionName="Productos">
                <Suspense fallback={<SectionLoader name="productos" />}>
                  {categoryProducts.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {categoryProducts.map((product) => (
                        <ProductListItem
                          key={product.id}
                          product={product}
                          onClick={handleProductClick}
                          onAddToCart={handleAddToCart}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <p className="text-dark-muted text-sm sm:text-base">{t('home.noProductsInCategory')}</p>
                    </div>
                  )}
                </Suspense>
              </SectionErrorBoundary>
            </div>
          </section>
        )}

        {/* Search Results Section - only when there's a search */}
        {searchQuery && (
          <section className="px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-3 sm:mb-4">
                {t('home.searchResults', { query: searchQuery })}
              </h2>

              <SectionErrorBoundary sectionName="Products">
                <Suspense fallback={<SectionLoader name="results" />}>
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                      {filteredProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onClick={handleProductClick}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <p className="text-dark-muted text-sm sm:text-base">{t('home.noProducts')}</p>
                    </div>
                  )}
                </Suspense>
              </SectionErrorBoundary>
            </div>
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <SectionErrorBoundary sectionName="Navegación">
        <BottomNav onCloseTable={handleCloseTable} onAIChat={handleAIChat} />
      </SectionErrorBoundary>
    </div>
  )
}
