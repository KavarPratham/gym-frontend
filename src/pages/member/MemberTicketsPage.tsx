import { useState } from 'react'
import { Ticket, Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'

interface SupportTicket {
  id: string
  subject: string
  category: 'Billing' | 'Equipment' | 'Access' | 'Other'
  status: 'open' | 'resolved'
  description: string
  created_at: string
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: '1',
    subject: 'Request for Locker Replacement',
    category: 'Equipment',
    status: 'open',
    description: 'My locker (#45) key lock is stuck and cannot be turned properly. Need a replacement lock.',
    created_at: '2026-06-14',
  },
  {
    id: '2',
    subject: 'Double billing issue',
    category: 'Billing',
    status: 'resolved',
    description: 'I was charged twice for this month\'s premium quarterly subscription. The extra transaction was reference #TXN992.',
    created_at: '2026-06-05',
  },
]

export default function MemberTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS)
  const [createOpen, setCreateOpen] = useState(false)

  const [subject, setSubject] = useState('')
  const [category, setCategory] = useState<'Billing' | 'Equipment' | 'Access' | 'Other'>('Billing')
  const [description, setDescription] = useState('')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !description) return

    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      subject,
      category,
      status: 'open',
      description,
      created_at: new Date().toISOString().split('T')[0],
    }

    setTickets([newTicket, ...tickets])
    setCreateOpen(false)
    setSubject('')
    setDescription('')
    setCategory('Billing')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Tickets"
        description="Raise queries, report equipment damage, or seek help with billing."
        actions={
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> New Support Ticket
          </button>
        }
      />

      <div className="space-y-4 max-w-4xl">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl bg-card">
            <Ticket size={40} className="text-muted-foreground/30 mb-4" />
            <p className="font-semibold text-foreground">No support tickets raised</p>
            <p className="text-sm text-muted-foreground mt-1">If you have any issues, feel free to raise a support request.</p>
          </div>
        ) : (
          tickets.map(t => (
            <div
              key={t.id}
              className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:shadow-sm transition-shadow"
            >
              <div className={`p-3 rounded-xl shrink-0 ${t.status === 'open' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                }`}>
                <Ticket size={20} />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-foreground text-base leading-snug">{t.subject}</h3>
                  <Badge variant={t.status === 'open' ? 'warning' : 'success'}>
                    {t.status.toUpperCase()}
                  </Badge>
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-md text-muted-foreground font-medium">
                    {t.category}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{t.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>Created: {new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>Ticket ID: #{t.id}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Submit Support Request" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Subject *</label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Locker #12 lock malfunctioning"
              required
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Topic Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Billing">Billing & Subscription</option>
              <option value="Equipment">Broken Gym Equipment</option>
              <option value="Access">Locker & QR Code Access</option>
              <option value="Other">Other Issues</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Detailed Description *</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder="Please explain the issue you are experiencing..."
              required
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
