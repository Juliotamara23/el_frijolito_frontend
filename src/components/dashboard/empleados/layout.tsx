import { config } from '../../../config';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: `Empleados | Dashboard | ${config.site.name}`
};

export default function EmpleadosLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}