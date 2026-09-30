const channels = [
  { title: 'AIML', detail: 'Pattern and response assets in the verified Python repository.' },
  { title: 'Prolog', detail: 'Rule-based reasoning code in the verified repository.' },
  { title: 'Neo4j', detail: 'Graph integration code in the verified repository.' },
  { title: 'Memory', detail: 'A conceptual memory channel in the project architecture; persistence behavior is not verified here.' },
  { title: 'Sensor inputs', detail: 'A conceptual input channel associated with the project scope; no live sensor feed is shown.' },
] as const;

export function ChatbotSystemDemo() {
  return (
    <div className="mt-5 rounded-xl border border-border bg-card p-5 sm:p-6">
      <p className="text-sm leading-6 text-muted-foreground">Architecture walkthrough, not a live chatbot. The verified software record includes AIML assets, Prolog rules, Neo4j integration code, and a Python orchestrator.</p>
      <div role="group" aria-label="Hybrid chatbot system map" className="mt-5">
        <div className="rounded-lg border border-primary/40 bg-background p-4">
          <h3 className="font-semibold">Python orchestrator</h3>
          <p className="mt-1 text-sm text-muted-foreground">Routes between the documented software components and the proposed input and memory channels.</p>
        </div>
        <p aria-hidden="true" className="py-2 text-center text-primary">↓</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {channels.map((channel) => (
            <li key={channel.title} className="rounded-lg border border-border bg-background p-4">
              <h4 className="font-semibold">{channel.title}</h4>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{channel.detail}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">ESP32</strong> is named in the approved project scope as the hardware path for sensor input. Its hardware connection has not been independently verified, so this diagram does not imply a working connected device.</p>
      </div>
    </div>
  );
}
