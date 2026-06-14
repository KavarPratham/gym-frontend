import { useState } from 'react'
import { Calendar, Users, Clock, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'

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

export default function MemberClassesPage() {
  const [classes, setClasses] = useState<ClassSession[]>(INITIAL_CLASSES)
  const [bookedIds, setBookedIds] = useState<string[]>(['1']) // Start with 1 class already booked

  const toggleBooking = (id: string) => {
    setBookedIds(prev => {
      const isBooked = prev.includes(id)
      
      // Update enrollment counts in UI client-side
      setClasses(prevClasses =>
        prevClasses.map(c => {
          if (c.id === id) {
            return { ...c, enrolled: isBooked ? c.enrolled - 1 : c.enrolled + 1 }
          }
          return c
        })
      )

      return isBooked ? prev.filter(x => x !== id) : [...prev, id]
    })
  }

  const LEVEL_VARIANTS = {
    Beginner: 'success',
    Intermediate: 'default',
    Advanced: 'destructive',
  } as const

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Booking"
        description="Browse available fitness sessions and reserve slots in upcoming classes."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {classes.map(c => {
          const isBooked = bookedIds.includes(c.id)
          const isFull = c.enrolled >= c.capacity && !isBooked

          return (
            <div
              key={c.id}
              className={`bg-card border rounded-2xl p-5 flex flex-col justify-between shadow-sm transition-all duration-200 hover:shadow-md ${
                isBooked ? 'border-primary ring-1 ring-primary/10' : 'border-border'
              }`}
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
                    <span>{c.enrolled} / {c.capacity} Slots booked</span>
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

              <div className="pt-5 mt-5 border-t border-border">
                {isBooked ? (
                  <button
                    onClick={() => toggleBooking(c.id)}
                    className="w-full flex items-center justify-center gap-2 border border-primary text-primary hover:bg-primary/5 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    <CheckCircle2 size={15} /> Booked (Cancel Reservation)
                  </button>
                ) : (
                  <button
                    onClick={() => toggleBooking(c.id)}
                    disabled={isFull}
                    className={`w-full font-semibold py-2.5 rounded-xl text-sm transition-colors ${
                      isFull
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {isFull ? 'Class Full' : 'Reserve Slot'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
