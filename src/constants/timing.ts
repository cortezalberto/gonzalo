/**
 * Centralized timing constants
 *
 * All timeouts, delays, and animation durations should be defined here
 * to ensure consistency and make adjustments easier.
 */

// Animation durations
export const ANIMATION = {
  /** Modal slide up/fade in duration (CSS transition) */
  MODAL_DURATION_MS: 300,
  /** Success feedback display time before closing */
  SUCCESS_FEEDBACK_MS: 800,
  /** Cart/notification auto-close delay */
  AUTO_CLOSE_MS: 2000,
  /** Debounce delay for search input */
  SEARCH_DEBOUNCE_MS: 300,
  /** Carousel scroll animation delay */
  CAROUSEL_SCROLL_DELAY_MS: 300,
} as const

// Service Worker
export const SERVICE_WORKER = {
  /** Interval to check for SW updates */
  UPDATE_CHECK_INTERVAL_MS: 60 * 60 * 1000, // 1 hour
} as const

// Session
export const SESSION = {
  /** Default session expiry (8 hours = restaurant shift) */
  DEFAULT_EXPIRY_HOURS: 8,
  /** Stale data warning threshold */
  STALE_THRESHOLD_MS: 2 * 60 * 60 * 1000, // 2 hours
} as const

// API
export const API = {
  /** Request timeout */
  REQUEST_TIMEOUT_MS: 30000, // 30 seconds
  /** Rate limit window */
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
} as const

// Close table flow simulation
export const CLOSE_TABLE_FLOW = {
  /** Initial requesting state duration */
  REQUESTING_DELAY_MS: 1500,
  /** Min wait time for waiter response */
  WAITER_RESPONSE_MIN_MS: 2000,
  /** Max wait time for waiter response */
  WAITER_RESPONSE_MAX_MS: 4000,
} as const
