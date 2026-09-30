import { SchedulerExampleIntro, SchedulerExampleTable } from './scheduler-example';

export function SchedulerDemoFallback() {
  return <div className="rounded-xl border border-border bg-card p-5 sm:p-6"><SchedulerExampleIntro /><ol className="my-5 list-inside list-decimal space-y-2 text-sm leading-6"><li>Constraints: each course needs one room and time slot, and rooms cannot double-book.</li><li>Conflict: EX-101 and EX-202 both request Room A on Monday at 09:00.</li><li>Resolution: EX-202 moves to the next slot.</li></ol><SchedulerExampleTable /></div>;
}
