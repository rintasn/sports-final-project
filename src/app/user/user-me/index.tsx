// app/login/page.tsx  
"use client"; // Pastikan ini ada di bagian atas  
  
import { useRouter } from 'next/navigation';    
  
const BASE_URL = 'https://sport-reservation-api-bootcamp.do.dibimbing.id'; // Ganti dengan URL API Anda  
  
const UserMe: React.FC = () => {    
  const router = useRouter();    
    
  const handleRegisterRedirect = () => {    
    router.push('/register'); // Arahkan ke halaman register    
  };    
    
  return (    
    <div className="flex items-center justify-center min-h-screen bg-transparent relative overflow-hidden">    
      
    </div>    
  );    
};    
    
export default UserMe;    
