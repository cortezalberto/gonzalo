import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { registerSW } from 'virtual:pwa-register'
import { useTranslation } from 'react-i18next'

// Store
import { useTableStore } from './stores/tableStore'

// Utils
import { validateTableNumber } from './utils/validation'

// Pages
import Home from './pages/Home'

// Components
import JoinTable from './components/JoinTable'
import QRSimulator from './components/QRSimulator'
import NetworkStatus from './components/NetworkStatus'
import ErrorBoundary from './components/ErrorBoundary'

interface TableURLResult {
  table: string
  isValid: boolean
  error: string | null
}

/**
 * Reads and validates the table number from URL (?mesa=X)
 * Supports: ?mesa=5, ?mesa=VIP-1, ?table=12
 */
function getTableFromURL(): TableURLResult {
  const params = new URLSearchParams(window.location.search)
  const table = params.get('mesa') || params.get('table') || ''

  // If no parameter, it's valid (will show full form)
  if (!table) {
    return { table: '', isValid: true, error: null }
  }

  // Validate the table number
  const validation = validateTableNumber(table)
  return {
    table: validation.isValid ? table : '',
    isValid: validation.isValid,
    error: validation.error
  }
}

/**
 * Component to display invalid table error
 */
function InvalidTableError({ error, tableParam }: { error: string; tableParam: string }) {
  const { t } = useTranslation()

  const handleRetry = () => {
    // Navigate to version without parameter
    window.location.href = window.location.pathname
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-white tracking-tight mb-8">
          barijho<span className="text-primary">/</span>
        </h1>

        {/* Error icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>

        {/* Error message */}
        <h2 className="text-xl font-semibold text-white mb-2">
          {t('errors.invalidTable')}
        </h2>
        <p className="text-dark-muted mb-2">
          {t('errors.qrContainsInvalidTable')}
        </p>
        <p className="text-red-400 font-mono bg-dark-card px-3 py-2 rounded-lg mb-2 inline-block">
          "{tableParam}"
        </p>
        <p className="text-dark-muted text-sm mb-6">
          {error}
        </p>

        {/* Actions */}
        <button
          onClick={handleRetry}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl transition-colors mb-3"
        >
          {t('errors.enterTableManually')}
        </button>

        <p className="text-dark-muted text-xs">
          {t('errors.persistsContactWaiter')}
        </p>
      </div>
    </div>
  )
}

function AppContent() {
  const { t } = useTranslation()
  const session = useTableStore((state) => state.session)

  // State to control whether to show QR simulator or normal flow
  const [showQRSimulator, setShowQRSimulator] = useState(true)
  const [scannedTable, setScannedTable] = useState<string | null>(null)

  // Read and validate table from URL only once on mount
  const tableURLResult = useMemo(() => getTableFromURL(), [])

  // Save original parameter to show in error
  const originalTableParam = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('mesa') || params.get('table') || ''
  }, [])
  const [needRefresh, setNeedRefresh] = useState(false)
  // Use ref instead of state to avoid setState inside effect
  const updateSWRef = useRef<(() => Promise<void>) | null>(null)

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null
    let isActive = true // Track if effect is still active

    const sw = registerSW({
      onNeedRefresh() {
        if (isActive) setNeedRefresh(true)
      },
      onOfflineReady() {
        // PWA is ready to work offline
      },
      onRegistered(registration) {
        // Check for updates every hour - only if still mounted
        if (registration && isActive) {
          intervalId = setInterval(() => {
            if (isActive) registration.update()
          }, 60 * 60 * 1000)
        }
      }
    })

    // Save reference without triggering re-render
    updateSWRef.current = sw

    return () => {
      isActive = false // Prevent callbacks from running after unmount
      if (intervalId) {
        clearInterval(intervalId)
      }
      // Note: sw is the function to trigger update, should NOT be called in cleanup
    }
  }, [])

  const handleUpdate = useCallback(async () => {
    if (updateSWRef.current) {
      await updateSWRef.current()
      window.location.reload()
    }
  }, [])

  const handleDismiss = useCallback(() => {
    setNeedRefresh(false)
  }, [])

  // Handle QR scan (simulated)
  const handleScanQR = useCallback((tableNumber: string) => {
    setScannedTable(tableNumber)
    setShowQRSimulator(false)
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Network status indicator */}
      <NetworkStatus />

      {/* Update notification */}
      {needRefresh && (
        <div className="fixed bottom-20 left-4 right-4 z-50 bg-dark-card border border-dark-border text-white p-4 rounded-xl shadow-lg safe-area-bottom">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium">{t('pwa.newVersionAvailable')}</p>
              <p className="text-dark-muted text-sm mt-0.5">{t('pwa.updateForImprovements')}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleDismiss}
              className="flex-1 bg-dark-elevated text-white py-2.5 rounded-lg font-medium hover:bg-dark-border transition-colors"
            >
              {t('pwa.later')}
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors"
            >
              {t('pwa.update')}
            </button>
          </div>
        </div>
      )}

      {/* Application flow:
          1. If table in URL (real QR scanned) -> JoinTable with that table
          2. If active session -> Home (menu)
          3. If simulated QR scanned -> JoinTable with that table
          4. If nothing -> QRSimulator (initial screen)
      */}
      {!tableURLResult.isValid && tableURLResult.error ? (
        <InvalidTableError error={tableURLResult.error} tableParam={originalTableParam} />
      ) : session ? (
        <Home />
      ) : tableURLResult.table ? (
        // Real QR scanned (arrived with ?mesa=X in URL)
        <JoinTable defaultTableNumber={tableURLResult.table} />
      ) : scannedTable ? (
        // Simulated QR scanned
        <JoinTable defaultTableNumber={scannedTable} />
      ) : showQRSimulator ? (
        // Initial screen: table QR simulator
        <QRSimulator onScanQR={handleScanQR} />
      ) : (
        // Fallback to JoinTable without preselected table
        <JoinTable defaultTableNumber="" />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}
