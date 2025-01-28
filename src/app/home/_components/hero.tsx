import Image from 'next/image';      
import Link from 'next/link'; // Pastikan Anda mengimpor komponen Link      
  
const Hero = () => {      
  return (      
    <div className="hero min-h-screen relative overflow-hidden">      
      <div className="relative w-full h-full"> {/* Container untuk mengatur posisi gambar */}  
        <Image      
          src="https://ayo.co.id/assets/img/ayoindonesia-greysiapolii-3.jpg"      
          alt="AYO App Preview"
          className="relative w-full h-full inset-0 object-cover rounded-lg shadow-2xl"      
          layout="fill" // Mengatur gambar untuk mengisi seluruh area    
        />      
      </div>  
      <div className="hero-content flex-col lg:flex-row relative z-20">      
        <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center"> {/* Mengatur flex untuk memusatkan konten */}    
          <h1 className="text-6xl font-bold text-white">Super Sport Community App</h1> {/* Ukuran teks diperbesar */}    
          <p className="py-6 text-lg text-white"> {/* Ukuran teks diperbesar */}    
            Platform all-in-one untuk sewa lapangan, cari lawan sparring, atau cari kawan main bareng.         
            Olahraga makin mudah dan menyenangkan!        
          </p>        
          <div className="flex gap-4">        
            <Link href="https://play.google.com/store">        
              <Image         
                src="https://ayo.co.id/assets/Store/google-light.png"         
                alt="Get it on Google Play"         
                width={180} // Ukuran tombol diperbesar    
                height={60}        
              />        
            </Link>        
            <Link href="https://apps.apple.com">        
              <Image         
                src="https://ayo.co.id/assets/Store/app-light.png"         
                alt="Download on App Store"         
                width={180} // Ukuran tombol diperbesar    
                height={60}        
              />        
            </Link>        
          </div>        
        </div>      
      </div>      
    </div>      
  );      
};      
      
export default Hero; // Pastikan untuk mengekspor komponen      
