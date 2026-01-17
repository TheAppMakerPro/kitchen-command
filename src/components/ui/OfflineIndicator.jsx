import { useOffline } from '../../context/OfflineContext'

export default function OfflineIndicator() {
  const { isOnline, isSyncing, pendingActionsCount } = useOffline()

  // Don't show anything when online and no pending actions
  if (isOnline && pendingActionsCount === 0 && !isSyncing) {
    return null
  }

  return (
    <div className="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:right-auto z-50 animate-slide-up">
      {!isOnline ? (
        // Offline indicator
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-xl shadow-lg border border-gray-700 max-w-sm mx-auto sm:mx-0">
          <div className="relative">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-medium">You're offline</p>
            <p className="text-xs text-gray-400">
              {pendingActionsCount > 0
                ? `${pendingActionsCount} action${pendingActionsCount > 1 ? 's' : ''} will sync when online`
                : 'Viewing cached content'
              }
            </p>
          </div>
        </div>
      ) : isSyncing ? (
        // Syncing indicator
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-lg max-w-sm mx-auto sm:mx-0">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <div>
            <p className="text-sm font-medium">Syncing changes...</p>
            <p className="text-xs text-blue-200">{pendingActionsCount} pending</p>
          </div>
        </div>
      ) : pendingActionsCount > 0 ? (
        // Pending actions indicator (online but not synced yet)
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-lg max-w-sm mx-auto sm:mx-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="text-sm font-medium">Back online!</p>
            <p className="text-xs text-emerald-200">Changes synced successfully</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

// Compact version for header
export function OfflineStatusBadge() {
  const { isOnline, pendingActionsCount } = useOffline()

  if (isOnline && pendingActionsCount === 0) {
    return null
  }

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
      isOnline
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
        : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
    }`}>
      {!isOnline ? (
        <>
          <span className="w-1.5 h-1.5 bg-gray-500 rounded-full" />
          <span>Offline</span>
        </>
      ) : (
        <>
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
          <span>{pendingActionsCount} pending</span>
        </>
      )}
    </div>
  )
}
