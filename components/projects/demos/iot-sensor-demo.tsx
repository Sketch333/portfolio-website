const stages = [
  { title: 'Raw stream', detail: 'Multivariate readings from temperature, humidity, vibration, pressure, light, and gas sensors.' },
  { title: 'Cleaning and denoising', detail: 'Timestamp validation, missing-value handling, smoothing, and decomposition prepare the device series.' },
  { title: 'Anomaly detection', detail: 'The project README documents these methods:', methods: ['Z-score / IQR', 'Isolation Forest', 'Local Outlier Factor', 'Gaussian Mixture'] },
  { title: 'Health score', detail: 'The documented health index considers stability, missing data, noise, and anomaly rate.' },
  { title: 'Forecast', detail: 'The README describes temperature forecasting with ARIMA / SARIMA and Prophet; neural approaches are listed as optional.' },
] as const;

export function IotSensorDemo() {
  return (
    <div className="project-demo">
      <div className="project-demo-topbar"><span>Sensor analytics / inspect the workflow</span><span>Documented methods</span></div>
      <div className="project-demo-content">
      <p>Documented workflow · explanatory walkthrough. Select a stage to inspect its role.</p>
      <ol aria-label="Sensor analytics stages" className="video-stage-list iot-stage-list">
        {stages.map((stage, index) => (
          <li key={stage.title}>
            <details open={index === 2}>
              <summary><span className="video-stage-number">{String(index + 1).padStart(2, '0')}</span><h3>{stage.title}</h3><span className="video-stage-marker" aria-hidden="true">+</span></summary>
              <p>{stage.detail}</p>
              {'methods' in stage && <ul aria-label="Documented anomaly methods">
                {stage.methods.map((method) => <li key={method}>{method}</li>)}
              </ul>}
            </details>
          </li>
        ))}
      </ol>
      <p className="project-demo-disclaimer">This describes the repository workflow; it is not a live sensor feed or a performance report.</p>
      </div>
    </div>
  );
}
