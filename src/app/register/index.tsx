// pages/index.tsx  
import Register from './_components/register';  
  
const BASE_URL = 'https://sport-reservation-api-bootcamp.do.dibimbing.id'; // Ganti dengan URL API Anda  
  
const Home: React.FC = () => {  
  return (  
    <div className="flex items-center justify-center min-h-screen bg-transparent relative overflow-hidden">    
      <Register baseUrl={BASE_URL} />
    </div>      
  );  
};  
  
export default Home;  
