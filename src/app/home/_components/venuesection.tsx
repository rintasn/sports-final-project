import Image from 'next/image'; // Pastikan Anda mengimpor komponen Image  
  
const VenueSection = () => {  
  return (  
    <div className="bg-base-100">  
      <div className="container mx-auto px-4 md:px-8 pt-20"> {/* Menambahkan padding-top dan padding-x untuk memberikan ruang bagi FilterSelect */}  
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">  
          <div className="lg:w-1/2">  
            <div className="inline-flex rounded-lg mb-4 overflow-hidden">  
              <button className="px-6 py-2 bg-primary text-white">PEMILIK LAPANGAN</button>  
              <button className="px-6 py-2 bg-gray-200">PENYEWA</button>  
            </div>  
            <h2 className="text-4xl font-bold mb-4">  
              Kelola venue lebih praktis dan menguntungkan.  
            </h2>  
            <p className="mb-6">  
              Waktunya buat venue anda lebih dari sekedar venue. Semuanya dimulai dengan  
              pengelolaan yang simpel, fleksibel, dan profitable lewat AYO Venue Management.  
            </p>  
            <button className="btn btn-primary">Lihat Selengkapnya</button>  
          </div>  
          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">  
            <div className="col-span-2">  
              <Image  
                src="https://ayo.co.id/assets/img/venue-preview.png"  
                alt="Venue"  
                width={600} // Lebar gambar asli  
                height={400} // Tinggi gambar asli  
                className="w-full h-auto object-cover rounded-lg"  
              />  
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  
  );  
};  
  
export default VenueSection; // Pastikan untuk mengekspor komponen  
