'use client';

import { lazy, Suspense, useState, type ReactNode } from 'react';

const SchedulerDemo = lazy(() => import('./scheduler-demo').then((module) => ({ default: module.SchedulerDemo })));

export function SchedulerDemoLoader({ fallback }: { fallback: ReactNode }) {
  const [opened, setOpened] = useState(false);
  if (opened) return <Suspense fallback={fallback}><SchedulerDemo /></Suspense>;
  return <div>{fallback}<button type="button" onClick={() => setOpened(true)} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">Explore scheduling steps</button></div>;
}
