import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useOrderHistoryData,
  useCloseTableActions,
  useTableStore,
  useSession,
} from '../stores/tableStore'
import { useCloseTableFlow } from '../hooks'
import {
  CloseStatusView,
  PaidView,
  NoSessionView,
  DinersList,
  ConsumptionDetail,
  OrdersList,
} from '../components/close-table'
import type { SplitMethod, Diner, PaymentShare, OrderRecord } from '../types'

interface CloseTableProps {
  onBack: () => void
}

export default function CloseTable({ onBack }: CloseTableProps) {
  const { t } = useTranslation()
  const session = useSession()
  const { orders, totalConsumed, currentRound } = useOrderHistoryData()
  const { closeTable, getPaymentShares, leaveTable } = useCloseTableActions()
  const getDinerColor = useTableStore((state) => state.getDinerColor)

  const [activeTab, setActiveTab] = useState<'summary' | 'orders'>('summary')
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('by_consumption')

  const {
    closeStatus,
    waiterName,
    estimatedTime,
    error,
    isProcessing,
    startCloseFlow,
    confirmPayment,
    setError,
  } = useCloseTableFlow(closeTable)

  const handleCloseTable = useCallback(async () => {
    if (!session) return

    if (session.shared_cart.length > 0) {
      setError(t('closeTable.cartErrorPending'))
      return
    }

    await startCloseFlow()
  }, [session, startCloseFlow, setError, t])

  const handleLeaveTable = useCallback(() => {
    leaveTable()
    onBack()
  }, [leaveTable, onBack])

  // No session view
  if (!session) {
    return <NoSessionView onBack={onBack} />
  }

  // Processing states view
  if (isProcessing) {
    return (
      <CloseStatusView
        status={closeStatus}
        waiterName={waiterName}
        estimatedTime={estimatedTime}
        tableNumber={session.table_number}
        totalConsumed={totalConsumed}
        onConfirmPayment={confirmPayment}
      />
    )
  }

  // Paid view
  if (closeStatus === 'paid') {
    return (
      <PaidView
        totalConsumed={totalConsumed}
        tableNumber={session.table_number}
        waiterName={waiterName}
        onLeaveTable={handleLeaveTable}
      />
    )
  }

  const diners = session.diners
  const shares = getPaymentShares(splitMethod)
  const hasItemsInCart = session.shared_cart.length > 0

  return (
    <div className="min-h-screen bg-dark-bg safe-area-inset">
      {/* Header */}
      <CloseTableHeader tableNumber={session.table_number} onBack={onBack} />

      {/* Content */}
      <main className="px-4 sm:px-6 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Total */}
          <TotalCard
            totalConsumed={totalConsumed}
            ordersCount={orders.length}
            currentRound={currentRound}
          />

          {/* Warning if there are items in cart */}
          {hasItemsInCart && (
            <CartWarning cartItemsCount={session.shared_cart.length} />
          )}

          {/* Tabs */}
          <TabSelector
            activeTab={activeTab}
            ordersCount={orders.length}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          {activeTab === 'summary' ? (
            <SummaryTab
              diners={diners}
              shares={shares}
              orders={orders}
              splitMethod={splitMethod}
              onSplitMethodToggle={() =>
                setSplitMethod((m) => (m === 'equal' ? 'by_consumption' : 'equal'))
              }
              getDinerColor={getDinerColor}
            />
          ) : (
            <OrdersList orders={orders} getDinerColor={getDinerColor} />
          )}

          {/* Error */}
          {error && <ErrorBanner message={error} />}

          {/* Request bill button */}
          <button
            onClick={handleCloseTable}
            disabled={orders.length === 0 || hasItemsInCart}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-dark-elevated disabled:text-dark-muted text-white font-semibold py-4 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{t('closeTable.requestBill')}</span>
          </button>

          {orders.length === 0 && (
            <p className="text-dark-muted text-sm text-center">
              {t('closeTable.noOrdersToClose')}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}

// Sub-components

interface CloseTableHeaderProps {
  tableNumber: string
  onBack: () => void
}

function CloseTableHeader({ tableNumber, onBack }: CloseTableHeaderProps) {
  const { t } = useTranslation()
  return (
    <header className="bg-dark-bg border-b border-dark-border px-4 sm:px-6 py-4 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center hover:bg-dark-elevated transition-colors"
          aria-label={t('common.back')}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">{t('closeTable.title')}</h1>
          <p className="text-dark-muted text-sm">{t('header.table')} {tableNumber}</p>
        </div>
      </div>
    </header>
  )
}

interface TotalCardProps {
  totalConsumed: number
  ordersCount: number
  currentRound: number
}

function TotalCard({ totalConsumed, ordersCount, currentRound }: TotalCardProps) {
  const { t } = useTranslation()
  const orderWord = ordersCount === 1 ? t('closeTable.order_one') : t('closeTable.order_other')
  const roundWord = currentRound === 1 ? t('bottomNav.round') : t('bottomNav.round_plural')

  return (
    <div className="bg-dark-card rounded-xl p-6 text-center">
      <p className="text-dark-muted text-sm mb-1">{t('closeTable.totalConsumed')}</p>
      <p className="text-primary text-4xl font-bold">${totalConsumed.toFixed(2)}</p>
      <p className="text-dark-muted text-sm mt-2">
        {ordersCount} {orderWord} · {currentRound} {roundWord}
      </p>
    </div>
  )
}

function CartWarning({ cartItemsCount }: { cartItemsCount: number }) {
  const { t } = useTranslation()
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-start gap-3">
      <svg
        className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5"
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <p className="text-yellow-400 font-medium text-sm">{t('closeTable.cartWarningTitle')}</p>
        <p className="text-yellow-400/70 text-xs mt-1">
          {t('closeTable.cartWarning', { count: cartItemsCount })}
        </p>
      </div>
    </div>
  )
}

interface TabSelectorProps {
  activeTab: 'summary' | 'orders'
  ordersCount: number
  onTabChange: (tab: 'summary' | 'orders') => void
}

function TabSelector({ activeTab, ordersCount, onTabChange }: TabSelectorProps) {
  const { t } = useTranslation()
  return (
    <div className="bg-dark-card rounded-xl p-1 flex" role="tablist">
      <button
        role="tab"
        aria-selected={activeTab === 'summary'}
        onClick={() => onTabChange('summary')}
        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
          activeTab === 'summary'
            ? 'bg-primary text-white'
            : 'text-dark-muted hover:text-white'
        }`}
      >
        {t('closeTable.summary')}
      </button>
      <button
        role="tab"
        aria-selected={activeTab === 'orders'}
        onClick={() => onTabChange('orders')}
        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
          activeTab === 'orders'
            ? 'bg-primary text-white'
            : 'text-dark-muted hover:text-white'
        }`}
      >
        {t('closeTable.ordersCount', { count: ordersCount })}
      </button>
    </div>
  )
}

interface SummaryTabProps {
  diners: Diner[]
  shares: PaymentShare[]
  orders: OrderRecord[]
  splitMethod: SplitMethod
  onSplitMethodToggle: () => void
  getDinerColor: (dinerId: string) => string
}

function SummaryTab({
  diners,
  shares,
  orders,
  splitMethod,
  onSplitMethodToggle,
  getDinerColor,
}: SummaryTabProps) {
  const { t } = useTranslation()
  return (
    <div className="space-y-4">
      {/* Split method */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold">{t('closeTable.diners', { count: diners.length })}</h2>
        <button onClick={onSplitMethodToggle} className="text-primary text-sm font-medium">
          {splitMethod === 'equal' ? t('closeTable.byConsumption') : t('closeTable.equalSplit')}
        </button>
      </div>

      {/* Diners list */}
      <DinersList
        diners={diners}
        shares={shares}
        splitMethod={splitMethod}
        getDinerColor={getDinerColor}
      />

      {/* Consumption detail per diner (by consumption mode) */}
      {splitMethod === 'by_consumption' && orders.length > 0 && (
        <ConsumptionDetail
          diners={diners}
          orders={orders}
          getDinerColor={getDinerColor}
        />
      )}
    </div>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
      <p className="text-red-400 text-sm text-center">{message}</p>
    </div>
  )
}
