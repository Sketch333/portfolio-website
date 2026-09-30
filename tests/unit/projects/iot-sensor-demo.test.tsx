import { render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import { IotSensorDemo } from '@/components/projects/demos/iot-sensor-demo';

it('exposes every IoT stage and the documented anomaly methods without fabricated results', () => {
  render(<IotSensorDemo />);
  const stages = [...screen.getByRole('list', { name: 'Sensor analytics stages' }).querySelectorAll(':scope > li')];
  expect(stages.map((stage) => within(stage as HTMLElement).getByRole('heading').textContent)).toEqual([
    'Raw stream', 'Cleaning and denoising', 'Anomaly detection', 'Health score', 'Forecast',
  ]);
  const anomaly = stages[2];
  for (const method of ['Z-score / IQR', 'Isolation Forest', 'Local Outlier Factor', 'Gaussian Mixture']) {
    expect(within(anomaly as HTMLElement).getByText(method)).toBeInTheDocument();
  }
  expect(screen.getByText(/documented workflow/i)).toBeInTheDocument();
  expect(screen.queryByText(/accuracy|achieved|improved/i)).not.toBeInTheDocument();
});
