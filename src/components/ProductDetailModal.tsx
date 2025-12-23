import { useState, useEffect, useRef, useActionState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTableStore } from '../stores/tableStore'
import { getSafeImageUrl } from '../utils/validation'
import type { Product } from '../types'

interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

// React 19: Form state type for useActionState
interface AddToCartState {
  status: 'idle' | 'adding' | 'success'
  error: string | null
}

// Wrapper component to force remount when product changes
export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  // Use key to remount inner component when product changes, resetting all state
  if (!isOpen || !product) return null

  return (
    <ProductDetailModalInner
      key={product.id}
      product={product}
      onClose={onClose}
    />
  )
}

interface ProductDetailModalInnerProps {
  product: Product
  onClose: () => void
}

function ProductDetailModalInner({ product, onClose }: ProductDetailModalInnerProps) {
  const { t } = useTranslation()
  // State initialized fresh on each mount (due to key={product.id} in parent)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const addToCart = useTableStore((state) => state.addToCart)
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(true)
  const onCloseRef = useRef(onClose)

  // Keep onClose ref updated without triggering effect re-runs
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Validate image URL - memoized to avoid revalidation on every render
  const safeImageUrl = useMemo(
    () => getSafeImageUrl(product.image, 'product'),
    [product.image]
  )

  // React 19: useActionState for add to cart with automatic pending states
  const [formState, formAction, isPending] = useActionState(
    async (_prevState: AddToCartState, formData: FormData): Promise<AddToCartState> => {
      const qty = parseInt(formData.get('quantity') as string) || 1
      const itemNotes = formData.get('notes') as string

      // Add to cart
      addToCart({
        product_id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: qty,
        notes: itemNotes || undefined,
      })

      return { status: 'success', error: null }
    },
    { status: 'idle', error: null }
  )

  // Handle success state - close modal after showing success
  // Uses onCloseRef to avoid unnecessary effect re-runs when onClose changes
  useEffect(() => {
    if (formState.status === 'success') {
      // Clear any existing timeout
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }

      successTimeoutRef.current = setTimeout(() => {
        if (!isMountedRef.current) return
        onCloseRef.current()
      }, 800)
    }

    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [formState.status])

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current)
      }
    }
  }, [])

  // Handle escape key - uses ref to avoid re-registering listener on onClose change
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const incrementQuantity = () => setQuantity((q) => Math.min(q + 1, 10))
  const decrementQuantity = () => setQuantity((q) => Math.max(q - 1, 1))

  // product is guaranteed by wrapper component
  const totalPrice = product.price * quantity
  const showSuccess = formState.status === 'success'
  const isAdding = isPending || formState.status === 'adding'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-dark-card rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up sm:animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-dark-bg/80 flex items-center justify-center hover:bg-dark-elevated transition-colors"
          aria-label={t('product.close')}
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Product Image */}
        <div className="relative h-48 sm:h-56 bg-dark-elevated flex-shrink-0">
          <img
            src={safeImageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {product.badge && (
            <span className="absolute top-4 left-4 bg-badge-gold text-black text-xs px-2 py-1 rounded font-semibold">
              {product.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <form action={formAction} className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Hidden inputs for form data */}
          <input type="hidden" name="quantity" value={quantity} />
          <input type="hidden" name="notes" value={notes} />

          {/* Header */}
          <div className="mb-4">
            <h2 id="product-title" className="text-xl sm:text-2xl font-bold text-white mb-2">
              {product.name}
            </h2>
            <p className="text-dark-muted text-sm sm:text-base">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-white text-2xl font-bold">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="mb-4 p-3 bg-dark-elevated rounded-xl">
              <p className="text-dark-muted text-xs mb-1">{t('product.allergens')}:</p>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="text-xs bg-dark-border text-white px-2 py-1 rounded"
                  >
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="mb-4">
            <label htmlFor="notes-input" className="block text-white text-sm font-medium mb-2">
              {t('product.specialNotes')}
            </label>
            <textarea
              id="notes-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('product.notesPlaceholder')}
              disabled={isAdding}
              className="w-full bg-dark-elevated border border-dark-border rounded-xl p-3 text-white placeholder-dark-muted text-sm resize-none focus:outline-none focus:border-white transition-colors disabled:opacity-50"
              rows={2}
              maxLength={200}
            />
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-white font-medium">{t('product.quantity')}</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decrementQuantity}
                disabled={quantity <= 1 || isAdding}
                className="w-10 h-10 rounded-full bg-dark-elevated border border-dark-border flex items-center justify-center hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t('product.decreaseQuantity')}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
              </button>
              <span className="text-white font-bold text-xl w-8 text-center">{quantity}</span>
              <button
                type="button"
                onClick={incrementQuantity}
                disabled={quantity >= 10 || isAdding}
                className="w-10 h-10 rounded-full bg-dark-elevated border border-dark-border flex items-center justify-center hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t('product.increaseQuantity')}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Footer - Add to Cart Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isAdding}
              className={`w-1/2 py-3 px-4 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                showSuccess
                  ? 'bg-green-600 text-white'
                  : 'bg-white hover:bg-gray-100 text-dark-bg'
              } disabled:cursor-not-allowed`}
            >
              {showSuccess ? (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t('product.added')}</span>
                </>
              ) : isPending ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{t('product.adding')}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>{t('product.add')} ${totalPrice.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
