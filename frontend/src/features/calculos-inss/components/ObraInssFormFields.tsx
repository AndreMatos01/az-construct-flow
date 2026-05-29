import { ChevronDown, CircleHelp, Plus } from 'lucide-react'
import type { ReactNode } from 'react'

type FieldProps = {
  label: string
  required?: boolean
  info?: boolean
  error?: string | null
  children: ReactNode
  className?: string
}

export function ObraFormField({
  label,
  required,
  info,
  error,
  children,
  className = '',
}: FieldProps) {
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

type AccordionProps = {
  title: string
  open: boolean
  onToggle: () => void
  children?: ReactNode
  trailingIcon?: 'plus' | 'chevron'
}

export function ObraFormAccordion({
  title,
  open,
  onToggle,
  children,
  trailingIcon = 'chevron',
}: AccordionProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-900/5 dark:text-slate-100 dark:hover:bg-white/5"
        aria-expanded={open}
      >
        <span>{title}</span>
        {trailingIcon === 'plus' ? (
          <Plus
            className={[
              'size-4 text-slate-500 transition-transform dark:text-slate-400',
              open ? 'rotate-45' : '',
            ].join(' ')}
            aria-hidden="true"
          />
        ) : (
          <ChevronDown
            className={[
              'size-4 text-slate-500 transition-transform dark:text-slate-400',
              open ? 'rotate-180' : '',
            ].join(' ')}
            aria-hidden="true"
          />
        )}
      </button>
      {open && children ? (
        <div className="border-t border-slate-200/70 px-4 py-4 dark:border-white/10">
          {children}
        </div>
      ) : null}
    </div>
  )
}

/** Linha clicável no estilo do acordeão (abre modal ou ação externa). */
export function ObraFormAccordionTrigger({
  title,
  onClick,
  trailingIcon = 'plus',
}: {
  title: string
  onClick: () => void
  trailingIcon?: 'plus' | 'chevron'
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200/70 dark:bg-white/5 dark:ring-white/10">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-900/5 dark:text-slate-100 dark:hover:bg-white/5"
      >
        <span>{title}</span>
        {trailingIcon === 'plus' ? (
          <Plus
            className="size-4 text-slate-500 dark:text-slate-400"
            aria-hidden="true"
          />
        ) : (
          <ChevronDown
            className="size-4 text-slate-500 dark:text-slate-400"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  )
}
