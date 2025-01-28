// components/Register.tsx  
import { useState } from 'react';  
import { toast } from 'react-toastify';  
  
interface RegisterProps {  
  baseUrl: string;  
}  
  
const Register: React.FC<RegisterProps> = ({ baseUrl }) => {  
  const [email, setEmail] = useState<string>('');  
  const [name, setName] = useState<string>('');  
  const [password, setPassword] = useState<string>('');  
  const [cPassword, setCPassword] = useState<string>('');  
  const [role, setRole] = useState<string>('user');  
  const [error, setError] = useState<string | null>(null);  
  
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {  
    e.preventDefault();  
    setError(null);  
  
    const response = await fetch(`${baseUrl}/api/v1/register`, {  
      method: 'POST',  
      headers: {  
        'Content-Type': 'application/json',  
      },  
      body: JSON.stringify({ email, name, password, c_password: cPassword, role }),  
    });  
  
    const data = await response.json();  
  
    if (!response.ok) {  
      setError(data.message || 'Registration failed');  
      toast.error(data.message || 'Registration failed');  
    } else {  
      // Handle successful registration  
      toast.success(data.message || 'Registration successful');  
      console.log('Registration successful', data);  
      // Optionally, you can redirect the user or clear the form  
    }  
  };  
  
  return (  
    <div className="flex items-center justify-center min-h-screen  bg-transparent">  
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">  
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>  
        {error && <p className="text-red-500 text-center">{error}</p>}  
        <div className="mb-4">  
          <label className="block text-gray-700">Name</label>  
          <input  
            type="text"  
            value={name}  
            onChange={(e) => setName(e.target.value)}  
            className="input input-bordered w-full"  
            required  
          />  
        </div>  
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
        <div className="mb-4">  
          <label className="block text-gray-700">Confirm Password</label>  
          <input  
            type="password"  
            value={cPassword}  
            onChange={(e) => setCPassword(e.target.value)}  
            className="input input-bordered w-full"  
            required  
          />  
        </div>  
        <div className="mb-4">  
          <label className="block text-gray-700">Role</label>  
          <select aria-readonly="true"
            value={role}  
            onChange={(e) => setRole(e.target.value)}  
            className="select select-bordered w-full"  
          >  
            <option value="user">User</option>  
            <option value="admin">Admin</option>  
          </select>  
        </div>  
        <button type="submit" className="btn btn-primary w-full">Register</button>  
      </form>  
    </div>  
  );  
};  
  
export default Register;  
