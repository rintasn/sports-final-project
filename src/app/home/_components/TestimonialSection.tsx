import React, { useState } from 'react';
import Image from 'next/image';

const TestimonialSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      name: "Opi Hovidin",
      company: "Backbone Indonesia",
      content: "AYO Indonesia membawa revolusi di kalangan penggemar olahraga. Aplikasi ini memudahkan pencarian aktivitas olahraga, mengembangkan komunitas olahraga, dan memesan tempat olahraga. Ini adalah ekosistem olahraga yang menyeluruh.",
      image: "https://ayo.co.id/assets/logo/new-logo.svg"
    },
    {
      name: "Sarah Wijaya",
      company: "Sports Community Leader",
      content: "Sebagai pengelola komunitas olahraga, AYO sangat membantu kami dalam mengorganisir event dan menghubungkan dengan venue-venue olahraga. Fitur booking yang mudah dan sistem manajemen yang baik membuat semuanya lebih efisien.",
      image: "https://ayo.co.id/assets/logo/new-logo.svg"
    },
    {
      name: "Budi Santoso",
      company: "Venue Partner",
      content: "Bergabung dengan AYO meningkatkan visibilitas venue kami secara signifikan. Platform ini membantu kami menjangkau lebih banyak pelanggan dan mengelola booking dengan lebih baik. Benar-benar solusi yang komprehensif.",
      image: "https://ayo.co.id/assets/logo/new-logo.svg"
    },
    {
      name: "Linda Kusuma",
      company: "Regular User",
      content: "AYO mengubah cara saya berolahraga. Sekarang sangat mudah untuk mencari teman olahraga, booking lapangan, dan bergabung dengan komunitas yang sesuai dengan minat saya. Aplikasi yang benar-benar user-friendly!",
      image: "https://ayo.co.id/assets/logo/new-logo.svg"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="py-16 bg-red-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Apa kata Kawan AYO?
        </h2>
        <div className="carousel w-full relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={testimonial.image}
                        alt={`${testimonial.name}'s testimonial`}
                        width={60}
                        height={60}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-bold">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600">{testimonial.company}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">"{testimonial.content}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
        <div className="flex justify-center gap-2 mt-4">
            <button 
              className="btn btn-circle btn-sm bg-white hover:bg-gray-200"
              onClick={prevSlide}
            >
              ❮
            </button>
            <button 
              className="btn btn-circle btn-sm bg-white hover:bg-gray-200"
              onClick={nextSlide}
            >
              ❯
            </button>
          </div>
      </div>
    </div>
  );
};

export default TestimonialSection;