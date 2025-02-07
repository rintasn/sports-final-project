// app/login/page.tsx  
"use client"; // Pastikan ini ada di bagian atas  
  
import dynamic from 'next/dynamic';  
  
const Dashboard = dynamic(  
  () => import('./dashboard'),  
  { ssr: false }  
);  
  
const Page = () => {  
  return <Dashboard />;  
};  
  
export default Page;  
