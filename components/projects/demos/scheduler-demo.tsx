'use client';

import { useState } from 'react';
import { SchedulerExampleIntro, SchedulerExampleTable } from './scheduler-example';

type Stage = 'constraints' | 'conflicts' | 'resolved';

export function SchedulerDemo() {
  const [stage, setStage] = useState<Stage>('constraints');

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <SchedulerExampleIntro />
      <div className="mt-5 flex flex-wrap gap-2" aria-label="Walkthrough steps">
        <button type="button" onClick={() => setStage('constraints')} aria-current={stage === 'constraints' ? 'step' : undefined} className="rounded-md border border-border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Review constraints</button>
        <button type="button" onClick={() => setStage('conflicts')} aria-current={stage === 'conflicts' ? 'step' : undefined} className="rounded-md border border-border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Show scheduling conflicts</button>
        <button type="button" onClick={() => setStage('resolved')} aria-current={stage === 'resolved' ? 'step' : undefined} className="rounded-md border border-border px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Resolve scheduling conflicts</button>
      </div>
      <div className="mt-5" aria-live="polite" aria-atomic="true">
        {stage === 'constraints' && <div><h3 className="font-semibold">Constraints loaded</h3><p className="mt-2 text-sm leading-6">Each example course needs one room and time slot. A room cannot host two courses at once.</p></div>}
        {stage === 'conflicts' && <div><h3 className="font-semibold">Conflicts identified</h3><p className="mt-2 text-sm leading-6">EX-101 and EX-202 both request Room A on Monday at 09:00. One assignment must move.</p></div>}
        {stage === 'resolved' && <div><h3 className="font-semibold">Schedule resolved</h3><p className="my-2 text-sm leading-6">EX-202 moves to the next slot, leaving Room A available for EX-101.</p><SchedulerExampleTable /></div>}
      </div>
    </div>
  );
}
