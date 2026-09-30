const stages = [
  { title: 'Script', detail: 'Develop the narrative and identify what each passage needs to communicate.' },
  { title: 'Scene plan', detail: 'Break the script into scenes with visual intent and a reviewable sequence.' },
  { title: 'Model generation', detail: 'Generate candidate scene material from the plan; this stage is represented as a workflow, not a live model run.' },
  { title: 'Human validation', detail: 'Review generated candidates against the script and scene intent before accepting or revising them.' },
  { title: 'FFmpeg / render', detail: 'Assemble approved material into a rendered video output.' },
] as const;

export function VideoPipelineDemo() {
  return (
    <div className="project-demo project-video-demo">
      <div className="project-demo-topbar"><span>Pipeline / inspect the stages</span><span>Human checkpoint</span></div>
      <div className="project-demo-content">
        <p>Conceptual walkthrough of the human-in-the-loop pipeline. No generated output is presented as a verified project artifact. Select any stage to read its role.</p>
        <ol aria-label="Video pipeline stages" className="video-stage-list">
          {stages.map((stage, index) => (
            <li key={stage.title}>
              <details open={index === 0}>
                <summary>
                  <span className="video-stage-number">{String(index + 1).padStart(2, '0')}</span>
                  <h3>{stage.title}</h3>
                  <span className="video-stage-marker" aria-hidden="true">+</span>
                </summary>
                <p>{stage.detail}</p>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
