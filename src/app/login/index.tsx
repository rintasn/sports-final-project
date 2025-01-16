// app/login/page.tsx  
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
      <Login baseUrl={BASE_URL} onRegisterClick={handleRegisterRedirect} />    
        
      {/* Elemen Bola */}  
      <div className="bola" style={{ top: '20%', left: '10%' }}></div>  
      <div className="bola" style={{ top: '50%', left: '70%' }}></div>  
      <div className="bola" style={{ top: '80%', left: '30%' }}></div>  
  
      {/* Elemen Persegi */}  
      <div className="square" style={{ top: '30%', left: '80%' }}></div>  
      <div className="square" style={{ top: '60%', left: '20%' }}></div>  
    </div>    
  );    
};    
    
export default LoginPage;    
