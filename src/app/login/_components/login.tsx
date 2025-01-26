// app/login/_components/login.tsx  
"use client"  
  
import { useState } from 'react';          
import { toast } from 'react-toastify';          
  
interface LoginProps {          
  baseUrl: string;          
  onRegisterClick: () => void; // Tambahkan prop untuk navigasi ke register          
  router: any; // Tambahkan prop router          
}          
    
const Login: React.FC<LoginProps> = ({ baseUrl, onRegisterClick, router }) => {          
  const [email, setEmail] = useState<string>('');          
  const [password, setPassword] = useState<string>('');          
  const [error, setError] = useState<string | null>(null);          
    
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {          
    e.preventDefault();          
    setError(null);          
    
    const response = await fetch(`${baseUrl}/api/v1/login`, {          
      method: 'POST',          
      headers: {          
        'Content-Type': 'application/json',          
      },          
      body: JSON.stringify({ email, password }),          
    });          
    
    const data = await response.json();          
    
    if (!response.ok) {          
      setError(data.message || 'Login failed');          
      toast.error(data.message || 'Login failed');          
    } else {          
      // Handle successful login          
      toast.success(data.message || 'Login successful');          
      console.log('Login successful', data);    
    
      // Simpan token dan data pengguna ke localStorage      
      localStorage.setItem('token', data.data.token);      
      localStorage.setItem('BEARER_TOKEN', data.data.token);      
      localStorage.setItem('user', JSON.stringify({      
        name: data.data.name,      
        email: data.data.email,      
      }));      
    
      // Redirect to /user after successful login    
      router.push('/user'); // Redirect to the user page    
    }          
  };          
    
  return (          
    <div className="flex items-center justify-center min-h-screen bg-transparent">          
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">          
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>          
        {error && <p className="text-red-500 text-center">{error}</p>}          
        <div className="mb-4">          
          <label className="block text-gray-700">Email</label>          
          <input          
            type="email"          
            value={email}          
            onChange={(e) => setEmail(e.target.value)}          
            className="input input-bordered w-full"          
            required          
          />          
        </div>          
        <div className="mb-4">          
          <label className="block text-gray-700">Password</label>          
          <input          
            type="password"          
            value={password}          
            onChange={(e) => setPassword(e.target.value)}          
            className="input input-bordered w-full"          
            required          
          />          
        </div>          
        <button type="submit" className="btn btn-primary w-full">Login</button>        
        <p className="text-center mt-4">Belum punya akun? <a href="/register" className="text-blue-500">Register</a></p>            
      </form>            
    </div>            
  );            
};          
    
export default Login;          
