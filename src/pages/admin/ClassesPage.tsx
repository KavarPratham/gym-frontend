import { useState } from 'react'
import { Calendar, Plus, Users, Clock, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'

interface ClassSession {
  id: string
  name: string
  trainer: string
  time: string
  days: string[]
  capacity: number
  enrolled: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
}

const INITIAL_CLASSES: ClassSession[] = [
  {
    id: '1',
    name: 'Yoga Flow & Meditation',
    trainer: 'Anya Sharma',
    time: '07:00 AM - 08:00 AM',
    days: ['Mon', 'Wed', 'Fri'],
    capacity: 20,
    enrolled: 12,
    level: 'Beginner',
  },
  {
    id: '2',
    name: 'High Intensity Strength (HIIT)',
    trainer: 'Vikram Singh',
    time: '06:00 PM - 07:00 PM',
    days: ['Tue', 'Thu', 'Sat'],
    capacity: 15,
    enrolled: 15,
    level: 'Advanced',
  },
  {
    id: '3',
    name: 'Cardio Blast & Conditioning',
    trainer: 'Rahul Patel',
    time: '08:30 AM - 09:30 AM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    capacity: 25,
    enrolled: 18,
    level: 'Intermediate',
  },
]

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassSession[]>(INITIAL_CLASSES)
  const [createOpen, setCreateOpen] = useState(false)
  
  // Form state
  const [name, setName] = useState('')
  const [trainer, setTrainer] = useState('')
  const [time, setTime] = useState('07:00 AM - 08:00 AM')
  const [days, setDays] = useState<string[]>([])
  const [capacity, setCapacity] = useState(20)
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !trainer || days.length === 0) return

    const newClass: ClassSession = {
      id: Date.now().toString(),
      name,
      trainer,
      time,
      days,
      capacity,
      enrolled: 0,
      level,
    }

    setClasses([newClass, ...classes])
    setCreateOpen(false)
    // reset form
    setName('')
    setTrainer('')
    setDays([])
    setCapacity(20)
    setLevel('Beginner')
  }

  const handleDelete = (id: string) => {
    setClasses(classes.filter(c => c.id !== id))
  }

  const toggleDay = (day: string) => {
    setDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const LEVEL_VARIANTS = {
    Beginner: 'success',
    Intermediate: 'default',
    Advanced: 'destructive',
  } as const

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Schedule"
        description="Schedule, update, and manage trainer-led sessions for members."
        actions={
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} /> Schedule Class
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map(c => (
          <div
            key={c.id}
            className="bg-card border border-border rounded-2xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-foreground leading-snug">{c.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Trainer: <span className="font-medium text-foreground">{c.trainer}</span></p>
                </div>
                <Badge variant={LEVEL_VARIANTS[c.level]}>{c.level}</Badge>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground pt-1">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground/75" />
                  <span>{c.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-muted-foreground/75" />
                  <span className="font-medium text-foreground">{c.days.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-muted-foreground/75" />
                  <span>{c.enrolled} / {c.capacity} Enrolled</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (c.enrolled / c.capacity) * 100)}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border mt-5">
              <span className="text-xs text-muted-foreground">ID: #{c.id}</span>
              <button
                onClick={() => handleDelete(c.id)}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                title="Remove class"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Schedule New Class" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Class Name *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Morning Spin Session"
              required
              className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Trainer *</label>
              <input
                value={trainer}
                onChange={e => setTrainer(e.target.value)}
                placeholder="e.g. Coach Roy"
                required
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Target Level</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value as any)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Time Slot</label>
              <input
                value={time}
                onChange={e => setTime(e.target.value)}
                placeholder="e.g. 07:00 AM - 08:00 AM"
                required
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Capacity (Slots)</label>
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={e => setCapacity(Number(e.target.value))}
                required
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Days selector */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground block">Repeat Days *</label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    days.includes(d)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-input hover:bg-muted'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors"
            >
              Schedule Class
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
