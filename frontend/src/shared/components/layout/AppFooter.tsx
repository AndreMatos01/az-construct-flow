const currentYear = new Date().getFullYear()

export function AppFooter() {
  return (
    <footer className="sticky bottom-0 z-50 w-full border-t border-slate-200/70 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
      <div className="flex flex-col gap-2 px-4 py-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between md:px-6 dark:text-slate-300">
        <div className="text-justify">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            Contato
          </span>
          : (11) 99999-9999 · contato@azconstructflow.com
        </div>
        <div>
          © {currentYear} AZ ConstructFlow. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  )
}
