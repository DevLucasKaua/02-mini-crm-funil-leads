import type { Lead } from '../../lib/types'

interface BoardProps {
  onSelectLead: (lead: Lead) => void
}

// Stub — implementado na Fase 2A
export function Board(_props: BoardProps) {
  return <div className="py-8 text-sm text-slate-400">Board em construção…</div>
}
