'use client';

import { lazy, Suspense, useState, type ReactNode } from 'react';

const SchedulerDemo = lazy(() => import('./scheduler-demo').then((module) => ({ default: module.SchedulerDemo })));

export function SchedulerDemoLoader({ fallback }: { fallback: ReactNode }) {
  const [opened, setOpened] = useState(false);
  if (opened) return <Suspense fallback={fallback}><SchedulerDemo /></Suspense>;
  return <div>{fallback}<button type="button" onClick={() => setOpened(true)} className="project-demo-launch">Explore scheduling steps <span aria-hidden="true">↗</span></button></div>;
}
