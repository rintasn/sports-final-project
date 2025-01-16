"use client";
import dynamic from 'next/dynamic'

const Dashboard = dynamic(
  () => import('./index'),
  { ssr: false }
)

const Page = () => {
  return <Dashboard />;
};

export default Page;
