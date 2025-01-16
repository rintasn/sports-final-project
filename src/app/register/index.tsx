// pages/index.tsx  
import Register from './_components/register';  
  
const BASE_URL = 'https://sport-reservation-api-bootcamp.do.dibimbing.id'; // Ganti dengan URL API Anda  
  
const Home: React.FC = () => {  
  return (  
    <div className="flex items-center justify-center min-h-screen bg-transparent relative overflow-hidden">    
      <Register baseUrl={BASE_URL} />     
        
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
  
export default Home;  
