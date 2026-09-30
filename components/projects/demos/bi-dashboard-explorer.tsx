const lenses = [
  { title: 'KPI summaries', detail: 'The saved dashboard image shows profit, quantity, and sales summaries together.' },
  { title: 'Geographic view', detail: 'A world map shows the geographic perspective included in the report.' },
  { title: 'Product comparison', detail: 'Category bars compare Technology, Furniture, and Office Supplies.' },
  { title: 'Time trends', detail: 'Monthly trend lines sit alongside an order-year control.' },
] as const;

export function BiDashboardExplorer() {
  return (
    <div className="project-demo">
      <div className="project-demo-topbar"><span>Superstore / artifact guide</span><span>Power BI</span></div>
      <div className="project-demo-content">
        <p>Explore the four analysis areas visible in the static Power BI artifact. These notes describe the saved dashboard image; they do not present a live report or new results.</p>
        <ol aria-label="Dashboard analysis areas" className="bi-lens-list">
          {lenses.map((lens, index) => (
            <li key={lens.title}>
              <details open={index === 0}>
                <summary><span>{String(index + 1).padStart(2, '0')}</span><h3>{lens.title}</h3><span aria-hidden="true">+</span></summary>
                <p>{lens.detail}</p>
              </details>
            </li>
          ))}
        </ol>
        <a className="bi-artifact-link" href="/projects/superstore-dashboard.png">Inspect the original dashboard image <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  );
}
