// app/login/index.tsx    
"use client"; // Pastikan ini ada di bagian atas    
    
import { useRouter } from 'next/navigation';      
import Login from './_components/login';       
    
const BASE_URL = 'https://sport-reservation-api-bootcamp.do.dibimbing.id'; // Ganti dengan URL API Anda    
    
const LoginPage: React.FC = () => {      
  const router = useRouter();      
      
  const handleRegisterRedirect = () => {      
    router.push('/register'); // Arahkan ke halaman register      
  };      
      
  return (      
    <div className="flex items-center justify-center min-h-screen bg-transparent relative overflow-hidden">      
      <Login baseUrl={BASE_URL} onRegisterClick={handleRegisterRedirect} router={router} />      
    </div>      
  );      
};      
      
export default LoginPage;      
