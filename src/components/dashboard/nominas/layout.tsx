import { config } from '../../../config';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: `Nominas | Dashboard | ${config.site.name}`
};

export default function NominasLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}