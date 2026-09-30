import { SchedulerExampleCapacity, SchedulerExampleIntro, SchedulerExampleProgress, SchedulerExampleTable } from './scheduler-example';

export function SchedulerDemoFallback() {
  return (
    <div className="project-demo">
      <div className="project-demo-topbar"><span>Timetable planner / walkthrough</span><span>Illustrative data</span></div>
      <div className="project-demo-content">
        <SchedulerExampleIntro />
        <div className="project-demo-grid">
          <ol className="project-demo-steps" aria-label="Scheduling states">
            <li><span>01</span><strong>Constraints</strong><small>One room and time slot per course.</small></li>
            <li><span>02</span><strong>Conflict</strong><small>EX-101 and EX-202 both request Room A on Monday at 09:00.</small></li>
            <li><span>03</span><strong>Progress</strong><small>Illustrative CP-SAT sequence, not a live run.</small></li>
            <li><span>04</span><strong>Resolution</strong><small>EX-202 moves to the next slot.</small></li>
          </ol>
          <div className="project-demo-panel">
            <SchedulerExampleProgress />
            <div className="mt-6"><SchedulerExampleCapacity /></div>
            <div className="mt-6"><SchedulerExampleTable /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
