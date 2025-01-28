import React, { useState } from "react";  
import VenueCard from "./_components/VenueCard";  
import Navbar from "../_components/NavbarComponent";
  
const Home: React.FC = () => {  
  const [venues] = useState([  
    { id: 1, name: "Lapangan Futsal A", location: "Jakarta", rating: "4.5/5", sportType: "Futsal", imageUrl: "https://via.placeholder.com/300" },  
    { id: 2, name: "Lapangan Basket B", location: "Bandung", rating: "4.7/5", sportType: "Basketball", imageUrl: "https://via.placeholder.com/300" },  
    { id: 3, name: "Lapangan Futsal C", location: "Surabaya", rating: "4.3/5", sportType: "Futsal", imageUrl: "https://via.placeholder.com/300" },  
    { id: 4, name: "Lapangan Basket D", location: "Medan", rating: "4.8/5", sportType: "Basketball", imageUrl: "https://via.placeholder.com/300" },  
  ]);  
  
  return (  
    <main>
    <Navbar />
    <div className="mx-auto p-4">
    <header className="bg-red-500 text-white py-12 px-6 mb-8 rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">BOOKING LAPANGAN ONLINE TERBAIK</h1>
          <button className="bg-white text-red-500 px-6 py-3 rounded-lg font-bold hover:bg-red-100 transition duration-300">
            Daftarkan Venue
          </button>
        </div>
      </header> 
    </div>
    <div className="p-6 max-w-7xl mx-auto">          
     
      <div className="flex flex-wrap justify-center items-center mb-8">  
        <input  
          type="text"  
          placeholder="Cari nama venue"  
          className="w-full md:w-1/3 p-3 mr-4 mb-4 md:mb-0 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"  
        />  
        <select className="w-full md:w-1/4 p-3 mr-4 mb-4 md:mb-0 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">  
          <option value="">Pilih Kota</option>  
          <option value="jakarta">Jakarta</option>  
          <option value="bandung">Bandung</option>  
          <option value="surabaya">Surabaya</option>  
          <option value="medan">Medan</option>  
        </select>  
        <select className="w-full md:w-1/4 p-3 mr-4 mb-4 md:mb-0 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">  
          <option value="">Pilih Cabang Olahraga</option>  
          <option value="futsal">Futsal</option>  
          <option value="basketball">Basketball</option>  
        </select>  
        <button className="bg-blue-500 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">  
          Cari venue  
        </button>  
      </div>  
      <p className="text-center mb-8">Menampilkan {venues.length} venue tersedia</p>  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">  
        {venues.map((venue) => (  
          <VenueCard  
            key={venue.id}  
            name={venue.name}  
            location={venue.location}  
            rating={venue.rating}  
            sportType={venue.sportType}  
            imageUrl={venue.imageUrl}  
          />  
        ))}  
      </div>  
    </div>  
    </main>
  );  
};  
  
export default Home;  
