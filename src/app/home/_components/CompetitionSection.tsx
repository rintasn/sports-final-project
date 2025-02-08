import Image from 'next/image';  

const CompetitionSection = () => {
    return (
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">
            Cari kompetisi terbaik untuk tim Anda!
          </h2>
          <p className="text-center mb-12 max-w-3xl mx-auto">
            Ikuti berbagai pilihan kompetisi dari AYO Indonesia dan operator kompetisi lainnya. 
            Rasakan keseruan silaturahmi di lapangan bersama ribuan tim amatir lainnya sekarang juga!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image
                  src="https://ayo.co.id/assets/dummy/new_kompetisi_home1.png"
                  alt="Competition"
                  width={400}
                  height={300}
                  className="w-full"
                />
              </figure>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image
                  src="https://ayo.co.id/assets/dummy/new_kompetisi_home2.png"
                  alt="Competition"
                  width={400}
                  height={300}
                  className="w-full"
                />
              </figure>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <figure>
                <Image
                  src="https://ayo.co.id/assets/dummy/new_kompetisi_home3.png"
                  alt="Competition"
                  width={400}
                  height={300}
                  className="w-full"
                />
              </figure>
            </div>
          </div>
          <div className="text-center mt-8">
            {/* <button className="btn btn-primary">Lihat Kompetisi Terdaftar</button> */}
          </div>
        </div>
      </div>
    )
  }

  export default CompetitionSection