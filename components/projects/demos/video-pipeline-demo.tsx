const stages = [
  { title: 'Script', detail: 'Develop the narrative and identify what each passage needs to communicate.' },
  { title: 'Scene plan', detail: 'Break the script into scenes with visual intent and a reviewable sequence.' },
  { title: 'Model generation', detail: 'Generate candidate scene material from the plan; this stage is represented as a workflow, not a live model run.' },
  { title: 'Human validation', detail: 'Review generated candidates against the script and scene intent before accepting or revising them.' },
  { title: 'FFmpeg / render', detail: 'Assemble approved material into a rendered video output.' },
] as const;

export function VideoPipelineDemo() {
  return (
    <div className="mt-5 rounded-xl border border-border bg-card p-5 sm:p-6">
      <p className="text-sm leading-6 text-muted-foreground">Conceptual walkthrough of the human-in-the-loop pipeline. No generated output is presented as a verified project artifact.</p>
      <ol aria-label="Video pipeline stages" className="mt-5 grid gap-3">
        {stages.map((stage, index) => (
          <li key={stage.title} className="grid grid-cols-[2.5rem_1fr] gap-3 rounded-lg border border-border bg-background p-4">
            <span aria-hidden="true" className="font-mono text-sm text-primary">{String(index + 1).padStart(2, '0')}</span>
            <div><h3 className="font-semibold">{stage.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{stage.detail}</p></div>
          </li>
        ))}
      </ol>
    </div>
  );
}
