import { useState } from 'react'
import { Megaphone, Plus, Trash2, Calendar } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Modal } from '@/components/ui/Modal'

interface Announcement {
  id: string
  title: string
  content: string
  target: 'All Members' | 'Premium Members' | 'Staff Only'
  date: string
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'New CrossFit Racks Arrived',
    content: 'We are excited to announce that 4 new commercial CrossFit racks have been installed in the main floor area. Train safely!',
    target: 'All Members',
    date: '2026-06-12',
  },
  {
    id: '2',
    title: 'Maintenance Closure - Pool Area',
    content: 'The swimming pool will be closed for quarterly chemical maintenance and filter upgrades on Sunday, June 21st, from 8:00 AM to 4:00 PM.',
    target: 'All Members',
    date: '2026-06-10',
  },
  {
    id: '3',
    title: 'Trainer Workshop Schedule',
    content: 'Reminder to all trainers that the weekly CPR & client assessment workshop starts this Friday at 2:00 PM in Seminar Hall B.',
    target: 'Staff Only',
    date: '2026-06-08',
  },
]

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS)
  const [createOpen, setCreateOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [target, setTarget] = useState<'All Members' | 'Premium Members' | 'Staff Only'>('All Members')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) return

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title,
      content,
      target,
      date: new Date().toISOString().split('T')[0],
    }

    setAnnouncements([newAnnouncement, ...announcements])
    setCreateOpen(false)
    setTitle('')
    setContent('')
    setTarget('All Members')
  }

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id))
  }

  const badgeColor = {
    'All Members': 'bg-primary/10 text-primary',
    'Premium Members': 'bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400',
    'Staff Only': 'bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-400',
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements & Broadcasts"
        description="Broadcast notices, updates, or alerts to gym members and staff."
        actions={
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> New Announcement
          </button>
        }
      />

      <div className="space-y-4 max-w-4xl">
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl bg-card">
            <Megaphone size={40} className="text-muted-foreground/30 mb-4" />
            <p className="font-semibold text-foreground">No announcements yet</p>
            <p className="text-sm text-muted-foreground mt-1">Publish an update to notify your members.</p>
          </div>
        ) : (
          announcements.map(a => (
            <div
              key={a.id}
              className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:shadow-sm transition-shadow relative"
            >
              <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                <Megaphone size={20} />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-foreground text-base leading-snug">{a.title}</h3>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeColor[a.target]}`}>
                    {a.target}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{a.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span>ID: #{a.id}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors ml-auto self-start"
                title="Delete announcement"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Announcement Broadcast" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Boxing Ring Closure for Upgrades"
              required
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Target Audience</label>
            <select
              value={target}
              onChange={e => setTarget(e.target.value as any)}
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="All Members">All Members</option>
              <option value="Premium Members">Premium Members Only</option>
              <option value="Staff Only">Staff Only</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Message / Content *</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              placeholder="Enter details of your announcement…"
              required
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              Publish Notice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
