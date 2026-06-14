import { useMyProfile } from '@/hooks/useMembers'
import { usePlans } from '@/hooks/usePlans'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { CreditCard, Calendar, Clock, Star } from 'lucide-react'

export default function MemberPlansPage() {
  const { data: member, isLoading: memberLoading } = useMyProfile()
  const { data: plans = [], isLoading: plansLoading } = usePlans({ gym: member?.gym })

  const activeSub = member?.active_subscription

  const isLoading = memberLoading || plansLoading

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-5xl animate-pulse">
        <div className="h-8 w-48 bg-muted rounded-lg" />
        <div className="h-48 bg-muted rounded-2xl w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader
        title="My Plans & Billing"
        description="View your active subscription details and other plans available at your gym."
      />

      {/* Active Subscription details */}
      <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
        <h2 className="text-base font-semibold text-foreground mb-4 uppercase tracking-widest text-muted-foreground/85">
          Active Plan Status
        </h2>

        {activeSub ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-bold text-foreground text-xl">{activeSub.plan.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  ₹{Number(activeSub.plan.price).toLocaleString('en-IN')} · {activeSub.plan.duration_label}
                </p>
              </div>
              <Badge variant={activeSub.is_expiring_soon ? 'warning' : 'success'}>
                {activeSub.is_expiring_soon
                  ? `Expiring in ${activeSub.days_remaining} days`
                  : 'Active & Good Standing'
                }
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-5 border-t border-border">
              {[
                { icon: Calendar, label: 'Start Date', value: new Date(activeSub.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { icon: Calendar, label: 'Expiry Date', value: new Date(activeSub.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { icon: Clock, label: 'Days Remaining', value: `${activeSub.days_remaining} Days` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-muted text-muted-foreground shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-muted/20 border border-dashed border-border rounded-xl">
            <CreditCard size={36} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-medium text-foreground">No Active Plan Assigned</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Please contact your gym administration desk to purchase or activate a membership plan.
            </p>
          </div>
        )}
      </div>

      {/* Available plans grid */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1 uppercase tracking-widest text-muted-foreground/85">
          Available Gym Plans
        </h2>
        <p className="text-xs text-muted-foreground mb-6">Explore membership plans offered by your gym ({member?.gym_name}).</p>

        {plans.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No membership plans currently set up by this gym.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.filter(p => p.is_active).map(plan => {
              const isActivePlan = activeSub?.plan.id === plan.id
              return (
                <div
                  key={plan.id}
                  className={`bg-card border rounded-2xl p-5 flex flex-col gap-4 transition-all relative ${
                    isActivePlan
                      ? 'border-primary ring-1 ring-primary/20'
                      : plan.is_featured
                      ? 'border-border shadow-sm ring-1 ring-primary/10'
                      : 'border-border'
                  }`}
                >
                  {plan.is_featured && !isActivePlan && (
                    <div className="absolute -top-3 left-4">
                      <span className="flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        <Star size={10} fill="currentColor" /> Featured
                      </span>
                    </div>
                  )}

                  {isActivePlan && (
                    <div className="absolute -top-3 left-4">
                      <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        Your Current Plan
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{plan.description}</p>
                  </div>

                  <div className="flex items-end gap-1 my-2">
                    <span className="text-2xl font-bold text-foreground">₹{Number(plan.price).toLocaleString('en-IN')}</span>
                    <span className="text-xs text-muted-foreground mb-1">/ {plan.duration_label}</span>
                  </div>

                  {plan.features.length > 0 && (
                    <ul className="space-y-1.5 pt-2 border-t border-border">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-foreground">
                          <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
