// Restaurant types
export interface Restaurant {
  id: string
  name: string
  slug: string
  description: string
  logo?: string
  banner?: string
  theme_color: string
}

// Category types
export interface Category {
  id: string
  name: string
  icon?: string
  image?: string
  order: number
}

// Subcategory types
export interface Subcategory {
  id: string
  name: string
  category_id: string
  image: string
  order: number
}

// Product types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category_id: string
  subcategory_id: string
  featured: boolean
  popular: boolean
  badge?: string | null
  allergens?: string[]
}

// Diner types
export interface Diner {
  id: string
  name: string
  avatar_color: string  // Color to identify the diner
  joined_at: string
  is_current_user: boolean
  user_id?: string      // Backend user ID if authenticated
  email?: string        // Email if authenticated
  picture?: string      // Profile picture URL if authenticated
}

// Cart types - now with info of the diner who added the item
export interface CartItem {
  id: string
  product_id: string
  name: string
  price: number
  image: string
  quantity: number
  diner_id: string      // Who added this item
  diner_name: string    // Diner name
  notes?: string        // Special notes for the item
}

// Table Session - Shared table
export interface TableSession {
  id: string
  table_number: string
  table_name?: string
  restaurant_id: string
  status: 'active' | 'closed'
  created_at: string
  diners: Diner[]
  shared_cart: CartItem[]
}

// Order status types
export type OrderStatus =
  | 'submitted'   // Just submitted
  | 'confirmed'   // Confirmed by kitchen
  | 'preparing'   // In preparation
  | 'ready'       // Ready to serve
  | 'delivered'   // Delivered to table
  | 'paid'        // Paid
  | 'cancelled'   // Cancelled

// Order Record - Represents an order "round"
export interface OrderRecord {
  id: string
  round_number: number        // Round number (1, 2, 3...)
  items: CartItem[]
  subtotal: number            // Sum of items
  status: OrderStatus
  submitted_by: string        // Diner ID who submitted
  submitted_by_name: string   // Diner name
  submitted_at: string        // Submission timestamp
  confirmed_at?: string       // When kitchen confirmed
  ready_at?: string           // When ready
  delivered_at?: string       // When delivered
}

// Payment info for split bill
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'mixed'
export type SplitMethod = 'equal' | 'by_consumption' | 'custom'

export interface PaymentShare {
  diner_id: string
  diner_name: string
  amount: number
  paid: boolean
  paid_at?: string
  method?: PaymentMethod
}

export interface TablePayment {
  id: string
  table_session_id: string
  total_amount: number
  split_method: SplitMethod
  shares: PaymentShare[]
  completed: boolean
  completed_at?: string
}

/**
 * @deprecated Use OrderRecord instead. This type is only used in api.ts
 * for backwards compatibility with the backend API contract.
 * TODO: Remove when backend migrates to OrderRecord response format.
 */
export interface Order {
  id: string
  table_session_id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered'
  created_at: string
  submitted_by: string  // Diner ID who submitted the order
}

// Input for adding items to cart
export interface AddToCartInput {
  product_id: string
  name: string
  price: number
  image: string
  quantity?: number
  notes?: string
}

// Order submission process state
export type OrderState = 'idle' | 'submitting' | 'success' | 'error'

// ============================================
// Google OAuth Types
// ============================================

// User info returned from backend after Google auth
export interface AuthUser {
  id: string
  email: string
  full_name: string
  picture?: string
  is_verified: boolean
  role: string
  created_at: string
}

// Response from POST /api/v1/auth/google
export interface GoogleAuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: AuthUser
  is_new_user: boolean
}

// Google Identity Services callback response
export interface GoogleCredentialResponse {
  /** The JWT credential from Google (may be undefined on error) */
  credential?: string
  /** How the credential was selected */
  select_by?: string
  /** The Google Client ID */
  clientId?: string
  /** Error code if authentication failed */
  error?: string
  /** Error description URI */
  error_uri?: string
}

// Google Identity Services types (for window.google)
export interface GoogleAccountsId {
  initialize: (config: GoogleIdConfiguration) => void
  prompt: (callback?: (notification: PromptMomentNotification) => void) => void
  renderButton: (element: HTMLElement, options: GsiButtonConfiguration) => void
  disableAutoSelect: () => void
  cancel: () => void
}

export interface GoogleIdConfiguration {
  client_id: string
  callback: (response: GoogleCredentialResponse) => void
  auto_select?: boolean
  login_uri?: string
  native_callback?: (response: GoogleCredentialResponse) => void
  cancel_on_tap_outside?: boolean
  prompt_parent_id?: string
  nonce?: string
  context?: 'signin' | 'signup' | 'use'
  state_cookie_domain?: string
  ux_mode?: 'popup' | 'redirect'
  allowed_parent_origin?: string | string[]
  intermediate_iframe_close_callback?: () => void
  itp_support?: boolean
}

export interface PromptMomentNotification {
  isDisplayMoment: () => boolean
  isDisplayed: () => boolean
  isNotDisplayed: () => boolean
  getNotDisplayedReason: () => string
  isSkippedMoment: () => boolean
  getSkippedReason: () => string
  isDismissedMoment: () => boolean
  getDismissedReason: () => string
  getMomentType: () => string
}

export interface GsiButtonConfiguration {
  type?: 'standard' | 'icon'
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  logo_alignment?: 'left' | 'center'
  width?: number | string
  locale?: string
}

// Extend Window interface for google global
declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId
      }
    }
  }
}
