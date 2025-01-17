import Image from 'next/image';  
import Link from 'next/link';  
  
type NavbarProps = {  
  categories: {  
    id: number;  
    name: string;  
  }[];  
};  
  
const Navbar = ({ categories }: NavbarProps) => {  
  return (  
    <div className="navbar bg-base-100">  
      <div className="navbar-start">  
        <Link href="/">  
          <Image src="/logo-ayo.svg" alt="AYO Logo" width={100} height={40} />  
        </Link>  
      </div>  
      <div className="navbar-center hidden lg:flex">  
        <ul className="menu menu-horizontal px-1">  
          {categories.map(category => (  
            <li key={category.id}>  
              <Link href={`/categories/${category.id}`}>{category.name}</Link>  
            </li>  
          ))} 
        </ul>  
      </div>  
      <div className="navbar-end">  
        <Link href="/login" className="btn btn-ghost">Masuk</Link>  
        <Link href="/register" className="btn btn-primary">Daftar</Link>  
      </div>  
    </div>  
  );  
};  
  
export default Navbar;  
