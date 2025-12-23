import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { QRCodeSVG } from 'qrcode.react'

interface TableQR {
  id: string
  number: string
  status: 'free' | 'active' | 'ready'
  diners?: number
}

// Mock tables - simulates restaurant tables with physical QR codes
const MOCK_TABLES: TableQR[] = [
  { id: '1', number: '1', status: 'free' },
  { id: '2', number: '2', status: 'active', diners: 3 },
  { id: '3', number: '3', status: 'free' },
  { id: '4', number: '4', status: 'active', diners: 2 },
  { id: '5', number: '5', status: 'ready', diners: 4 },
  { id: '6', number: '6', status: 'free' },
  { id: '7', number: '7', status: 'free' },
  { id: '8', number: '8', status: 'active', diners: 5 },
  { id: '9', number: '9', status: 'free' },
  { id: '10', number: '10', status: 'free' },
  { id: '11', number: 'VIP-1', status: 'active', diners: 6 },
  { id: '12', number: 'VIP-2', status: 'free' },
]

interface QRSimulatorProps {
  onScanQR: (tableNumber: string) => void
}

type ViewMode = 'grid' | 'single'

export default function QRSimulator({ onScanQR }: QRSimulatorProps) {
  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedTable, setSelectedTable] = useState<TableQR | null>(null)
  const [filter, setFilter] = useState<'all' | 'free'>('all')

  const filteredTables = useMemo(() => {
    if (filter === 'free') {
      return MOCK_TABLES.filter(t => t.status === 'free')
    }
    return MOCK_TABLES
  }, [filter])

  const stats = useMemo(() => ({
    total: MOCK_TABLES.length,
    free: MOCK_TABLES.filter(t => t.status === 'free').length,
    active: MOCK_TABLES.filter(t => t.status !== 'free').length,
  }), [])

  // Generates the URL that the physical table QR would have
  const getQRUrl = (tableNumber: string) => {
    const baseUrl = window.location.origin
    return `${baseUrl}?mesa=${encodeURIComponent(tableNumber)}`
  }

  const getStatusColor = (status: TableQR['status']) => {
    switch (status) {
      case 'free': return 'bg-green-500'
      case 'active': return 'bg-yellow-500'
      case 'ready': return 'bg-blue-500'
    }
  }

  const getStatusText = (status: TableQR['status']) => {
    switch (status) {
      case 'free': return t('qrSimulator.statusFree')
      case 'active': return t('qrSimulator.statusActive')
      case 'ready': return t('qrSimulator.statusReady')
    }
  }

  const handleScanQR = (table: TableQR) => {
    // Simulates QR scanning by navigating with table parameter
    onScanQR(table.number)
  }

  const handleSelectTable = (table: TableQR) => {
    setSelectedTable(table)
    setViewMode('single')
  }

  const handleBack = () => {
    setSelectedTable(null)
    setViewMode('grid')
  }

  // Individual QR view (simulates being in front of the physical table)
  if (viewMode === 'single' && selectedTable) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col">
        {/* Header */}
        <header className="bg-dark-bg border-b border-dark-border px-4 sm:px-6 py-4 safe-area-top">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-dark-muted hover:text-white transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span>{t('qrSimulator.back')}</span>
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-center">
              barijho<span className="text-primary">/</span>
            </h1>
          </div>
        </header>

        {/* QR Display - Simula el QR físico de la mesa */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
          <div className="w-full max-w-sm">
            {/* Simulación de cartel de mesa */}
            <div className="bg-dark-card rounded-2xl p-6 border border-dark-border shadow-xl">
              {/* Mesa number badge */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(selectedTable.status)}/20`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(selectedTable.status)}`} />
                  <span className={`text-sm font-medium ${
                    selectedTable.status === 'free' ? 'text-green-400' :
                    selectedTable.status === 'ready' ? 'text-blue-400' : 'text-yellow-400'
                  }`}>
                    {getStatusText(selectedTable.status)}
                  </span>
                </div>
              </div>

              {/* Table number */}
              <div className="text-center mb-6">
                <p className="text-dark-muted text-sm mb-1">{t('qrSimulator.table')}</p>
                <p className="text-4xl font-bold text-white">{selectedTable.number}</p>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-xl p-4 mb-6">
                <QRCodeSVG
                  value={getQRUrl(selectedTable.number)}
                  size={200}
                  level="M"
                  includeMargin={false}
                  className="w-full h-auto"
                />
              </div>

              {/* Instructions */}
              <p className="text-dark-muted text-center text-sm mb-6">
                {t('qrSimulator.scanInstruction')}
              </p>

              {/* Simulate scan button */}
              <button
                onClick={() => handleScanQR(selectedTable)}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                </svg>
                {t('qrSimulator.simulateScan')}
              </button>
            </div>

            {/* Diners info if active */}
            {selectedTable.diners && (
              <div className="mt-4 bg-dark-card rounded-xl p-4 border border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">{selectedTable.diners} {t('qrSimulator.diners')}</p>
                    <p className="text-dark-muted text-sm">{t('qrSimulator.dinersAtTable')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

  // Table grid view (to select which QR to simulate)
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <header className="bg-dark-bg border-b border-dark-border px-4 sm:px-6 py-4 safe-area-top">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              barijho<span className="text-primary">/</span>
            </h1>
            <p className="text-dark-muted text-sm mt-1">{t('qrSimulator.title')}</p>
          </div>

          {/* Info card */}
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{t('qrSimulator.simulationMode')}</p>
                <p className="text-dark-muted text-xs mt-0.5">
                  {t('qrSimulator.simulationDescription')}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-dark-card rounded-lg p-2 text-center">
              <p className="text-white font-bold text-lg">{stats.total}</p>
              <p className="text-dark-muted text-xs">{t('qrSimulator.total')}</p>
            </div>
            <div className="bg-dark-card rounded-lg p-2 text-center">
              <p className="text-green-400 font-bold text-lg">{stats.free}</p>
              <p className="text-dark-muted text-xs">{t('qrSimulator.free')}</p>
            </div>
            <div className="bg-dark-card rounded-lg p-2 text-center">
              <p className="text-yellow-400 font-bold text-lg">{stats.active}</p>
              <p className="text-dark-muted text-xs">{t('qrSimulator.occupied')}</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-dark-card text-dark-muted hover:text-white'
              }`}
            >
              {t('qrSimulator.allTables')}
            </button>
            <button
              onClick={() => setFilter('free')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                filter === 'free'
                  ? 'bg-primary text-white'
                  : 'bg-dark-card text-dark-muted hover:text-white'
              }`}
            >
              {t('qrSimulator.onlyFree')}
            </button>
          </div>
        </div>
      </header>

      {/* Tables Grid */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredTables.map((table) => (
              <button
                key={table.id}
                onClick={() => handleSelectTable(table)}
                className={`relative bg-dark-card rounded-xl p-4 border-2 transition-all hover:scale-[1.02] ${
                  table.status === 'free'
                    ? 'border-green-500/30 hover:border-green-500'
                    : table.status === 'ready'
                    ? 'border-blue-500/30 hover:border-blue-500'
                    : 'border-yellow-500/30 hover:border-yellow-500'
                }`}
              >
                {/* Status indicator */}
                <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${getStatusColor(table.status)}`} />

                {/* Mini QR preview */}
                <div className="bg-white rounded-lg p-2 mb-3 mx-auto w-fit">
                  <QRCodeSVG
                    value={getQRUrl(table.number)}
                    size={60}
                    level="L"
                    includeMargin={false}
                  />
                </div>

                {/* Table number */}
                <p className="text-white font-bold text-lg text-center">{table.number}</p>

                {/* Status */}
                <p className={`text-xs font-medium text-center mt-1 ${
                  table.status === 'free' ? 'text-green-400' :
                  table.status === 'ready' ? 'text-blue-400' : 'text-yellow-400'
                }`}>
                  {getStatusText(table.status)}
                </p>

                {/* Diners */}
                {table.diners && (
                  <div className="flex items-center justify-center gap-1 text-dark-muted text-xs mt-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    <span>{table.diners}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="bg-dark-card border-t border-dark-border px-4 sm:px-6 py-4 safe-area-bottom">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 text-xs text-dark-muted">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span>{t('qrSimulator.statusFree')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <span>{t('qrSimulator.statusActive')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>{t('qrSimulator.statusReady')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
