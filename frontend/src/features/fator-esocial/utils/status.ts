import type { FatorESocialStatus } from '../types/fatorEsocial.types'

export function chipStatusClasses(status: FatorESocialStatus) {
  if (status === 'LEAD_QUENTE') {
    return 'bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-100 dark:ring-emerald-300/20'
  }
  if (status === 'LEAD_MORNO') {
    return 'bg-amber-500/15 text-amber-900 ring-1 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-100 dark:ring-amber-300/20'
  }
  return 'bg-slate-900/5 text-slate-700 ring-1 ring-slate-200/70 dark:bg-white/5 dark:text-slate-200 dark:ring-white/10'
}

export function statusLabel(status: FatorESocialStatus) {
  if (status === 'LEAD_QUENTE') return 'Lead Quente'
  if (status === 'LEAD_MORNO') return 'Lead Morno'
  return 'Lead Frio'
}
