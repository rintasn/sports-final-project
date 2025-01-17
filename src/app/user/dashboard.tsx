"use client"; // Pastikan ini ada di bagian atas  
  
import { useRouter } from 'next/navigation';  
import { useEffect } from 'react';  
  
const BASE_URL = 'https://sport-reservation-api-bootcamp.do.dibimbing.id'; // Ganti dengan URL API Anda  
  
const User: React.FC = () => {  
  const router = useRouter();  
  
  useEffect(() => {  
    // Check if user is authenticated (you can implement your own logic)  
    const token = localStorage.getItem('token');  
    if (!token) {  
      router.push('/login'); // Redirect to login if not authenticated  
    }  
  }, [router]);  
  
  return (  
    <div className="bg-base-200 min-h-screen text-base-content">  
      <Navbar />  
      <div className="container mx-auto p-6">  
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h1>  
        <p className="text-lg mb-6">Here you can manage your reservations and settings.</p>  
        {/* Add more user-related content here */}  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  
          <Card title="My Reservations" description="View and manage your reservations." />  
          <Card title="Profile Settings" description="Update your profile information." />  
          <Card title="Help & Support" description="Get assistance with your account." />  
        </div>  
      </div>  
    </div>  
  );  
};  
  
const Navbar: React.FC = () => {  
  return (  
    <nav className="bg-gradient-to-r from-primary to-secondary p-4 shadow-lg">  
      <div className="container mx-auto flex justify-between items-center">  
        <div className="text-2xl font-bold text-white">Super Sport</div>  
        <ul className="flex space-x-4">  
          <li>  
            <a href="/user" className="btn btn-ghost text-white hover:text-gray-200 transition">Dashboard</a>  
          </li>  
          <li>  
            <a href="/reservations" className="btn btn-ghost text-white hover:text-gray-200 transition">Reservations</a>  
          </li>  
          <li>  
            <a href="/profile" className="btn btn-ghost text-white hover:text-gray-200 transition">Profile</a>  
          </li>  
          <li>  
            <button onClick={handleLogout} className="btn btn-ghost text-white hover:text-gray-200 transition">Logout</button>  
          </li>  
        </ul>  
      </div>  
    </nav>  
  );  
};  
  
const Card: React.FC<{ title: string; description: string }> = ({ title, description }) => {  
  return (  
    <div className="card bg-base-100 shadow-xl">  
      <div className="card-body">  
        <h2 className="card-title">{title}</h2>  
        <p>{description}</p>  
        <div className="card-actions justify-end">  
          <button className="btn btn-primary">Go</button>  
        </div>  
      </div>  
    </div>  
  );  
};  
  
const handleLogout = () => {  
  localStorage.removeItem('token');  
  localStorage.removeItem('user');  
  window.location.href = '/login'; // Redirect to login page  
};  
  
export default User;  
