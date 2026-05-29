import { Loader2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { obraFormInputClass } from '@/features/calculos-inss/components/obraFormStyles'
import { FormField } from '@/shared/components/ui'
import {
  validarDocumentoCpfOuCnpj,
  validarEmail,
} from '@/shared/lib/validation/document'

const MSG_OBRIGATORIO = 'Este campo é obrigatório'
const MSG_EMAIL_INVALIDO = 'Informe um e-mail válido (ex.: nome@empresa.com.br)'

export type NovoCliente = {
  nome: string
  documento: string
  email: string
  telefone: string
}

type Props = {
  onClose: () => void
  onSalvar: (cliente: NovoCliente) => void | Promise<void>
  salvando?: boolean
}

export function CadastroClienteModal({
  onClose,
  onSalvar,
  salvando = false,
}: Props) {
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [submetido, setSubmetido] = useState(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !salvando) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, salvando])

  const erros = useMemo(() => {
    const doc = validarDocumentoCpfOuCnpj(documento)
    const emailTrim = email.trim()
    return {
      nome: !nome.trim() ? MSG_OBRIGATORIO : null,
      documento: doc.ok ? null : doc.mensagem,
      email:
        emailTrim && !validarEmail(emailTrim) ? MSG_EMAIL_INVALIDO : null,
    }
  }, [nome, documento, email])

  function campoErro(chave: keyof typeof erros) {
    return submetido ? erros[chave] : null
  }

  const formularioInvalido = Boolean(erros.nome || erros.documento || erros.email)

  async function handleSalvar() {
    setSubmetido(true)
    if (formularioInvalido) return
    await onSalvar({
      nome: nome.trim(),
      documento: documento.trim(),
      email: email.trim(),
      telefone: telefone.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-3 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={() => !salvando && onClose()}
        aria-label="Fechar cadastro de cliente"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cadastro-cliente-titulo"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200/70 dark:bg-slate-950 dark:ring-white/10"
      >
        <div className="flex items-start justify-between gap-3 border-b border-slate-200/70 p-4 dark:border-white/10">
          <div className="min-w-0">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Obras contratuais
            </p>
            <h2
              id="cadastro-cliente-titulo"
              className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100"
            >
              Cadastrar novo cliente
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900/5 p-2 text-slate-900 ring-1 ring-slate-200/70 hover:bg-slate-900/10 disabled:opacity-60 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
            aria-label="Fechar"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <form
          className="max-h-[75dvh] space-y-4 overflow-auto p-4"
          onSubmit={(e) => {
            e.preventDefault()
            void handleSalvar()
          }}
        >
          <FormField
            label="Nome do cliente:"
            required
            error={campoErro('nome')}
          >
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome completo ou razão social"
              className={obraFormInputClass}
              autoFocus
            />
          </FormField>

          <FormField
            label="CPF / CNPJ:"
            required
            error={campoErro('documento')}
          >
            <input
              type="text"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              className={obraFormInputClass}
            />
          </FormField>

          <FormField label="E-mail:" error={campoErro('email')}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className={obraFormInputClass}
              autoComplete="email"
            />
          </FormField>

          <FormField label="Telefone:">
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              className={obraFormInputClass}
            />
          </FormField>

          <div className="flex flex-col-reverse gap-2 border-t border-slate-200/70 pt-4 sm:flex-row sm:justify-end dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={salvando}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900/5 px-4 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200/70 transition hover:bg-slate-900/10 disabled:opacity-60 dark:bg-white/5 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
            >
              {salvando ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              Salvar cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
