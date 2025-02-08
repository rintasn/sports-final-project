import { useState } from 'react'; // Import useState hook
import Image from 'next/image'; // Ensure you import the Image component

const VenueSection = () => {
  // Initialize state to track the selected option
  const [selectedOption, setSelectedOption] = useState<'PEMILIK LAPANGAN' | 'PENYEWA'>('PEMILIK LAPANGAN');

  // Function to handle button click and update state
  const handleOptionClick = (option: 'PEMILIK LAPANGAN' | 'PENYEWA') => {
    setSelectedOption(option);
  };

  // Conditional rendering based on the selected option
  const renderContent = () => {
    if (selectedOption === 'PEMILIK LAPANGAN') {
      return (
        <>
          <h2 className="text-4xl font-bold mb-4">
            Kelola venue lebih praktis dan menguntungkan.
          </h2>
          <p className="mb-6">
            Waktunya buat venue anda lebih dari sekedar venue. Semuanya dimulai dengan
            pengelolaan yang simpel, fleksibel, dan profitable lewat AYO Venue Management.
          </p>
        </>
      );
    } else if (selectedOption === 'PENYEWA') {
      return (
        <>
          <h2 className="text-4xl font-bold mb-4">
            Temukan dan sewa venue dengan mudah.
          </h2>
          <p className="mb-6">
            Nikmati pengalaman sewa venue yang cepat, mudah, dan terpercaya dengan AYO Venue Management.
          </p>
        </>
      );
    }
  };

  return (
    <div className="bg-base-100">
      <div className="container mx-auto px-4 md:px-8 pt-20">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          <div className="lg:w-1/2">
            <div className="inline-flex rounded-lg mb-4 overflow-hidden">
              <button
                className={`px-6 py-2 ${selectedOption === 'PEMILIK LAPANGAN' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                onClick={() => handleOptionClick('PEMILIK LAPANGAN')}
              >
                PEMILIK LAPANGAN
              </button>
              <button
                className={`px-6 py-2 ${selectedOption === 'PENYEWA' ? 'bg-primary text-white' : 'bg-gray-200'}`}
                onClick={() => handleOptionClick('PENYEWA')}
              >
                PENYEWA
              </button>
            </div>
            {renderContent()}
            {/* <button className="btn btn-primary">Lihat Selengkapnya</button> */}
          </div>
          <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <Image
                src="https://ayo.co.id/assets/img/venue-preview.png"
                alt="Venue"
                width={600} // Original image width
                height={400} // Original image height
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueSection; // Ensure to export the component
