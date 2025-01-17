import Image from 'next/image';  

const TestimonialSection = () => {
    return (
      <div className="py-16 bg-red-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Apa kata Kawan AYO?
          </h2>
          <div className="carousel w-full">
            <div className="carousel-item w-full">
              <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/testimonial-1.jpg"
                    alt="Testimonial"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">Opi Hovidin</h3>
                    <p className="text-sm text-gray-600">Backbone Indonesia</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "AYO Indonesia membawa revolusi di kalangan penggemar olahraga. Aplikasi ini 
                  memudahkan pencarian aktivitas olahraga, mengembangkan komunitas olahraga, dan 
                  memesan tempat olahraga. Ini adalah ekosistem olahraga yang menyeluruh."
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            <button className="btn btn-circle btn-sm">❮</button>
            <button className="btn btn-circle btn-sm">❯</button>
          </div>
        </div>
      </div>
    )
  }
  
  export default TestimonialSection