'use client';

import { useState } from 'react';
import { SchedulerExampleCapacity, SchedulerExampleIntro, SchedulerExampleProgress, SchedulerExampleTable } from './scheduler-example';

type Stage = 'constraints' | 'conflicts' | 'progress' | 'resolved';

export function SchedulerDemo() {
  const [stage, setStage] = useState<Stage>('constraints');

  return (
    <div className="project-demo">
      <div className="project-demo-topbar"><span>Timetable planner / walkthrough</span><span>Illustrative data</span></div>
      <div className="project-demo-content">
        <SchedulerExampleIntro />
        <div className="project-demo-grid">
          <div className="project-demo-controls" aria-label="Walkthrough steps">
            <button type="button" onClick={() => setStage('constraints')} aria-current={stage === 'constraints' ? 'step' : undefined}><span aria-hidden="true">01</span> Review constraints</button>
            <button type="button" onClick={() => setStage('conflicts')} aria-current={stage === 'conflicts' ? 'step' : undefined}><span aria-hidden="true">02</span> Show scheduling conflicts</button>
            <button type="button" onClick={() => setStage('progress')} aria-current={stage === 'progress' ? 'step' : undefined}><span aria-hidden="true">03</span> Inspect CP-SAT progress</button>
            <button type="button" onClick={() => setStage('resolved')} aria-current={stage === 'resolved' ? 'step' : undefined}><span aria-hidden="true">04</span> Resolve scheduling conflicts</button>
          </div>
          <div className="project-demo-panel" aria-live="polite" aria-atomic="true">
            {stage === 'constraints' && <div><h3 className="font-semibold">Constraints loaded</h3><p className="mt-2 text-sm leading-6">Each example course needs one room and time slot. A room cannot host two courses at once.</p></div>}
            {stage === 'conflicts' && <div><h3 className="font-semibold">Conflicts identified</h3><p className="mt-2 text-sm leading-6">EX-101 and EX-202 both request Room A on Monday at 09:00. One assignment must move.</p></div>}
            {stage === 'progress' && <SchedulerExampleProgress />}
            {stage === 'resolved' && <div><h3 className="font-semibold">Schedule resolved</h3><p className="my-2 text-sm leading-6">EX-202 moves to the next slot, leaving Room A available for EX-101.</p><SchedulerExampleCapacity /><div className="mt-5"><SchedulerExampleTable /></div></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
