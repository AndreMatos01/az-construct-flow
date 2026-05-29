import { ChevronDown, Plus } from 'lucide-react'
import type { ReactNode } from 'react'

type FormAccordionProps = {
  title: string
  open: boolean
  onToggle: () => void
  children?: ReactNode
  trailingIcon?: 'plus' | 'chevron'
}

export function FormAccordion({
  title,
  open,
  onToggle,
  children,
  trailingIcon = 'chevron',
}: FormAccordionProps) {
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
export function FormAccordionTrigger({
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
