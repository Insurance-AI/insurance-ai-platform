// app/dashboard/page.jsx
"use client";

import dynamic from 'next/dynamic';

// Dynamically import the dashboard component to avoid hydration issues
const InsuranceAnalysisDashboard = dynamic(
  () => import('@/components/InsuranceAnalysisDashboard'),
  { ssr: false }
);

export default function DashboardPage() {
  return <InsuranceAnalysisDashboard />;
}