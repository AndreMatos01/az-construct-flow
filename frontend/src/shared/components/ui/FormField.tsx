import { CircleHelp } from 'lucide-react'
import type { ReactNode } from 'react'

type FormFieldProps = {
  label: string
  required?: boolean
  info?: boolean
  error?: string | null
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  required,
  info,
  error,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center gap-1.5">
        {required ? (
          <span
            className="text-sm font-medium text-rose-500 dark:text-rose-400"
            aria-hidden="true"
          >
            *
          </span>
        ) : null}
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
          {label}
        </span>
        {info ? (
          <CircleHelp
            className="size-3.5 shrink-0 text-slate-400 dark:text-slate-500"
            aria-label="Mais informações"
          />
        ) : null}
      </div>
      {children}
      {error ? (
        <p
          className="mt-1.5 text-xs text-rose-600 dark:text-rose-400"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  )
}
