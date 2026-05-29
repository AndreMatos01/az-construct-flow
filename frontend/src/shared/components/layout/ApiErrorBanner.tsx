import { CircleAlert } from 'lucide-react'

type Props = {
  message: string
  title?: string
}

export function ApiErrorBanner({
  message,
  title = 'Não foi possível carregar os dados',
}: Props) {
  return (
    <div
      role="alert"
      className="border-b border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950 md:px-6 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100"
    >
      <div className="mx-auto flex max-w-6xl gap-3">
        <CircleAlert
          className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-300"
          aria-hidden="true"
        />
        <div className="min-w-0 space-y-1">
          <p className="font-semibold">{title}</p>
          <p className="text-amber-900/90 dark:text-amber-50/90">{message}</p>
        </div>
      </div>
    </div>
  )
}
