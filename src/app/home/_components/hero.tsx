// app/components/Hero.tsx  
import Image from 'next/image';  
import Link from 'next/link'; // Pastikan Anda mengimpor komponen Link  
  
const Hero = () => {  
  return (  
    <div className="hero min-h-screen bg-gradient-to-r from-gray-900 to-red-900">  
      <div className="hero-content flex-col lg:flex-row-reverse">  
        <Image  
          src="/hero-app.png"  
          alt="AYO App Preview"  
          width={400}  
          height={800}  
          className="max-w-sm rounded-lg shadow-2xl"  
        />  
        <div>  
          <h1 className="text-5xl font-bold text-white">Super Sport Community App</h1>  
          <p className="py-6 text-white">  
            Platform all-in-one untuk sewa lapangan, cari lawan sparring, atau cari kawan main bareng.   
            Olahraga makin mudah dan menyenangkan!  
          </p>  
          <div className="flex gap-4">  
            <Link href="https://play.google.com/store">  
              <Image   
                src="/google-play.png"   
                alt="Get it on Google Play"   
                width={150}   
                height={50}  
              />  
            </Link>  
            <Link href="https://apps.apple.com">  
              <Image   
                src="/app-store.png"   
                alt="Download on App Store"   
                width={150}   
                height={50}  
              />  
            </Link>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
};  
  
export default Hero; // Pastikan untuk mengekspor komponen  
