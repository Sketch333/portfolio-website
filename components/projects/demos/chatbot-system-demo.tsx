const channels = [
  { title: 'AIML', detail: 'Pattern and response assets in the verified Python repository.' },
  { title: 'Prolog', detail: 'Rule-based reasoning code in the verified repository.' },
  { title: 'Neo4j', detail: 'Graph integration code in the verified repository.' },
  { title: 'Memory', detail: 'A conceptual memory channel in the project architecture; persistence behavior is not verified here.' },
  { title: 'Sensor inputs', detail: 'A conceptual input channel associated with the project scope; no live sensor feed is shown.' },
] as const;

export function ChatbotSystemDemo() {
  return (
    <div className="project-demo">
      <div className="project-demo-topbar"><span>Hybrid reasoning / architecture map</span><span>Inspectable channels</span></div>
      <div className="project-demo-content">
        <p>Architecture walkthrough, not a live chatbot. The verified software record includes AIML assets, Prolog rules, Neo4j integration code, and a Python orchestrator.</p>
        <div role="group" aria-label="Hybrid chatbot system map" className="chatbot-map">
          <div className="chatbot-orchestrator">
            <span className="project-story-kicker">Routing layer</span>
            <h3>Python orchestrator</h3>
            <p>Routes between the documented software components and the proposed input and memory channels.</p>
          </div>
          <ul className="chatbot-channels">
            {channels.map((channel, index) => (
              <li key={channel.title}>
                <details open={index === 0}>
                  <summary><span>{String(index + 1).padStart(2, '0')}</span><h4>{channel.title}</h4><span aria-hidden="true">+</span></summary>
                  <p>{channel.detail}</p>
                </details>
              </li>
            ))}
          </ul>
          <p className="chatbot-evidence"><strong>ESP32</strong> is named in the approved project scope as the hardware path for sensor input. Its hardware connection has not been independently verified, so this diagram does not imply a working connected device.</p>
        </div>
      </div>
    </div>
  );
}
