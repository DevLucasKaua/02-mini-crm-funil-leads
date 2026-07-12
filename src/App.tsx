import { useState } from 'react'
import type { Lead } from './lib/types'
import { MetricsBar } from './features/metrics/MetricsBar'
import { Board } from './features/board/Board'
import { BoardFilters } from './features/board/BoardFilters'
import { LeadDrawer } from './features/lead-detail/LeadDrawer'

function App() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-3 md:px-6">
        <h1 className="text-lg font-semibold">Funil de Leads</h1>
        <p className="text-sm text-slate-500">
          Painel interno E3 — gestão de leads jurídicos
        </p>
      </header>
      <MetricsBar />
      <BoardFilters />
      <main className="flex-1 px-4 pb-4 md:px-6">
        <Board onSelectLead={setSelectedLead} />
      </main>
      <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </div>
  )
}

export default App
