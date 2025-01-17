// app/components/VenueSection.tsx  
import Image from 'next/image'; // Pastikan Anda mengimpor komponen Image  
  
const VenueSection = () => {  
    return (  
      <div className="py-16 bg-base-200">  
        <div className="container mx-auto px-4">  
          <div className="flex flex-col lg:flex-row items-center gap-8">  
            <div className="lg:w-1/2">  
              <div className="tabs tabs-boxed mb-4">  
                <a className="tab tab-active">PEMILIK LAPANGAN</a>  
                <a className="tab">PENYEWA</a>  
              </div>  
              <h2 className="text-4xl font-bold mb-4">  
                Kelola venue lebih praktis dan menguntungkan.  
              </h2>  
              <p className="mb-6">  
                Waktunya buat venue anda lebih dari sekadar venue. Semuanya dimulai dengan  
                pengelolaan yang simpel, fleksibel, dan profitable lewat AYO Venue Management.  
              </p>  
              <button className="btn btn-primary">Lihat Selengkapnya</button>  
            </div>  
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">  
              <Image  
                src="/venue-1.jpg"  
                alt="Venue"  
                width={300}  
                height={200}  
                className="rounded-lg"  
              />  
              <Image  
                src="/venue-2.jpg"  
                alt="Venue"  
                width={300}  
                height={200}  
                className="rounded-lg"  
              />  
              <Image  
                src="/venue-3.jpg"  
                alt="Venue"  
                width={300}  
                height={200}  
                className="rounded-lg"  
              />  
              <Image  
                src="/venue-4.jpg"  
                alt="Venue"  
                width={300}  
                height={200}  
                className="rounded-lg"  
              />  
            </div>  
          </div>  
        </div>  
      </div>  
    );  
};  
  
export default VenueSection; // Pastikan untuk mengekspor komponen  
