const stages = [
  { title: 'Raw stream', detail: 'Multivariate readings from temperature, humidity, vibration, pressure, light, and gas sensors.' },
  { title: 'Cleaning and denoising', detail: 'Timestamp validation, missing-value handling, smoothing, and decomposition prepare the device series.' },
  { title: 'Anomaly detection', detail: 'The project README documents these methods:', methods: ['Z-score / IQR', 'Isolation Forest', 'Local Outlier Factor', 'Gaussian Mixture'] },
  { title: 'Health score', detail: 'The documented health index considers stability, missing data, noise, and anomaly rate.' },
  { title: 'Forecast', detail: 'The README describes temperature forecasting with ARIMA / SARIMA and Prophet; neural approaches are listed as optional.' },
] as const;

export function IotSensorDemo() {
  return (
    <div className="rounded-2xl border bg-card p-5 text-card-foreground sm:p-7">
      <p className="text-sm text-muted-foreground">Documented workflow · explanatory walkthrough</p>
      <ol aria-label="Sensor analytics stages" className="mt-6 grid gap-3">
        {stages.map((stage, index) => (
          <li key={stage.title} className="rounded-xl border p-4">
            <details open={index === 2 ? true : undefined}>
              <summary className="cursor-pointer rounded-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                <span className="mr-3 font-mono text-sm text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>{stage.title}
              </summary>
              <p className="mt-3 leading-7 text-muted-foreground">{stage.detail}</p>
              {'methods' in stage && <ul className="mt-3 flex flex-wrap gap-2" aria-label="Documented anomaly methods">
                {stage.methods.map((method) => <li key={method} className="rounded-full border px-3 py-1 text-sm">{method}</li>)}
              </ul>}
            </details>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-sm text-muted-foreground">This describes the repository workflow; it is not a live sensor feed or a performance report.</p>
    </div>
  );
}
