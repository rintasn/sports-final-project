const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

import Link from 'next/link';
import Image from 'next/image';
import { Home, ShoppingCart, CreditCard, User, Airplay, LogOut } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook

type NavbarProps = {
  categories: {
    id: number;
    name: string;
  }[];
};

const Navbar = ({ categories }: NavbarProps) => {
  // Retrieve the user data from localStorage
  const userData = localStorage.getItem('user');
  const userObject = userData ? JSON.parse(userData) : null;
  const { toast } = useToast(); // Initialize the toast hook

  // Access the 'role' property from the user object
  const role = userObject ? userObject.role : null;

  const handleLogout = async () => {
    const BEARER_TOKEN = localStorage.getItem('BEARER_TOKEN');
    
    try {
      const response = await fetch(`${BASE_URL}/api/v1/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          // Add any necessary authentication headers here if required
        },
      });

      if (response.ok) {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        // Show a toast notification for successful logout
        toast({
          title: "Logout Berhasil",
          description: "Anda telah berhasil logout dari akun Anda.",
          variant: "default",
        });
        // Refresh the page
        window.location.href = '/login';
      } else {
        console.error('Logout failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <Link href="/">
          <Image src="https://ayo.co.id/assets/logo/new-logo.svg" alt="AYO Logo" width={100} height={40} />
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {categories.map(category => (
            <li key={category.id}>
              <a href={`/home/cabang-olahraga?sport_category_id=${category.id}`}>{category.name}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        {role ? (
          <>
            {role === 'admin' && (
              <Link href="/admin" className="btn btn-ghost">
                <Airplay className="w-6 h-6" />
              </Link>
            )}
            {/* <Link href="/home/cart" className="btn btn-ghost">
              <ShoppingCart className="w-6 h-6" />
            </Link> */}
            <Link href="/home/my-transactions" className="btn btn-ghost ml-2">
              <CreditCard className="w-6 h-6" />
            </Link>
            <Link href="/home/profile" className="btn btn-ghost ml-2">
              <User className="w-6 h-6" />
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost ml-2">
              <LogOut className="w-6 h-6" />
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost">Masuk</Link>
            <Link href="/register" className="btn btn-ghost ml-2 text-red-900">Daftar</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
