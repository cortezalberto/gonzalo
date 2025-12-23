import { useTranslation } from 'react-i18next'
import LoadingSpinner from '../ui/LoadingSpinner'

export type CloseStatus =
  | 'idle'
  | 'requesting'
  | 'waiting'
  | 'waiter_coming'
  | 'bill_ready'
  | 'paid'

interface CloseStatusViewProps {
  status: CloseStatus
  waiterName: string
  estimatedTime: number
  tableNumber: string
  totalConsumed: number
  onConfirmPayment: () => void
}

export function CloseStatusView({
  status,
  waiterName,
  estimatedTime,
  tableNumber,
  totalConsumed,
  onConfirmPayment,
}: CloseStatusViewProps) {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 safe-area-inset">
      <div className="w-full max-w-sm">
        {status === 'requesting' && <RequestingState />}
        {status === 'waiting' && <WaitingState />}
        {status === 'waiter_coming' && (
          <WaiterComingState
            waiterName={waiterName}
            estimatedTime={estimatedTime}
            tableNumber={tableNumber}
            totalConsumed={totalConsumed}
          />
        )}
        {status === 'bill_ready' && (
          <BillReadyState
            waiterName={waiterName}
            totalConsumed={totalConsumed}
            onConfirmPayment={onConfirmPayment}
          />
        )}
      </div>
    </div>
  )
}

function RequestingState() {
  const { t } = useTranslation()
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{t('closeTable.requestingBill')}</h1>
      <p className="text-dark-muted">{t('closeTable.sendingRequest')}</p>
    </div>
  )
}

function WaitingState() {
  const { t } = useTranslation()
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-yellow-400 animate-pulse"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{t('closeTable.billRequested')}</h1>
      <p className="text-dark-muted mb-6">{t('closeTable.waitingWaiterAccept')}</p>
      <div className="bg-dark-card rounded-xl p-4">
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}

interface WaiterComingStateProps {
  waiterName: string
  estimatedTime: number
  tableNumber: string
  totalConsumed: number
}

function WaiterComingState({
  waiterName,
  estimatedTime,
  tableNumber,
  totalConsumed,
}: WaiterComingStateProps) {
  const { t } = useTranslation()
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{t('closeTable.waiterOnWay')}</h1>
      <p className="text-dark-muted mb-6">
        <span className="text-blue-400 font-medium">{waiterName}</span> {t('closeTable.approachingTable')}
      </p>
      <div className="bg-dark-card rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-dark-muted text-sm">{t('closeTable.estimatedTime', { time: '' }).replace(': ', '')}</span>
          <span className="text-white font-medium">~{estimatedTime} min</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-dark-muted text-sm">{t('closeTable.table')}</span>
          <span className="text-white font-medium">{tableNumber}</span>
        </div>
        <div className="flex items-center justify-between border-t border-dark-border pt-3">
          <span className="text-dark-muted text-sm">{t('closeTable.total')}</span>
          <span className="text-primary font-bold text-xl">${totalConsumed.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

interface BillReadyStateProps {
  waiterName: string
  totalConsumed: number
  onConfirmPayment: () => void
}

function BillReadyState({ waiterName, totalConsumed, onConfirmPayment }: BillReadyStateProps) {
  const { t } = useTranslation()
  return (
    <div className="text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-green-500"
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
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{t('closeTable.billDelivered')}</h1>
      <p className="text-dark-muted mb-6">
        <span className="text-green-400 font-medium">{waiterName}</span> {t('closeTable.deliveredBill')}
      </p>

      {/* Bill summary */}
      <div className="bg-dark-card rounded-xl p-4 mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-dark-muted text-sm">{t('closeTable.subtotal')}</span>
          <span className="text-white">${totalConsumed.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-dark-muted text-sm">{t('closeTable.suggestedTip')}</span>
          <span className="text-white">${(totalConsumed * 0.1).toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-dark-border pt-3">
          <span className="text-white font-medium">{t('closeTable.suggestedTotal')}</span>
          <span className="text-primary font-bold text-xl">
            ${(totalConsumed * 1.1).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-dark-card rounded-xl p-4 mb-6">
        <p className="text-dark-muted text-sm mb-3">{t('closeTable.paymentMethod')}</p>
        <PaymentMethodSelector />
      </div>

      <button
        onClick={onConfirmPayment}
        className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-4 rounded-xl transition-colors"
      >
        {t('closeTable.confirmPayment')}
      </button>
    </div>
  )
}

function PaymentMethodSelector() {
  const { t } = useTranslation()
  return (
    <div className="grid grid-cols-3 gap-2">
      <button className="bg-dark-elevated hover:bg-dark-border rounded-lg p-3 flex flex-col items-center gap-1 transition-colors border-2 border-primary">
        <svg
          className="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
          />
        </svg>
        <span className="text-primary text-xs font-medium">{t('closeTable.card')}</span>
      </button>
      <button className="bg-dark-elevated hover:bg-dark-border rounded-lg p-3 flex flex-col items-center gap-1 transition-colors">
        <svg
          className="w-5 h-5 text-dark-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
          />
        </svg>
        <span className="text-dark-muted text-xs">{t('closeTable.cash')}</span>
      </button>
      <button className="bg-dark-elevated hover:bg-dark-border rounded-lg p-3 flex flex-col items-center gap-1 transition-colors">
        <svg
          className="w-5 h-5 text-dark-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
          />
        </svg>
        <span className="text-dark-muted text-xs">{t('closeTable.qr')}</span>
      </button>
    </div>
  )
}
