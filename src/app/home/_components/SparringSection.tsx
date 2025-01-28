import Image from 'next/image'

const SparringSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <Image
              src="https://ayo.co.id/assets/img/hp-ayo2.png"
              alt="AYO Sparring Feature"
              width={400}
              height={800}
              className="rounded-3xl shadow-xl"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-red-800 mb-2">TEMUKAN LAWAN SPARRING</h2>
            <h3 className="text-4xl font-bold mb-4">
              Cari lawan sparring hanya dalam ketukan jari.
            </h3>
            <p className="mb-6 text-gray-600">
              Kini kamu ga perlu pusing-pusing cari lawan sparring. Dapatkan teman dan 
              lawan baru dengan mudah tiap minggunya hanya di Aplikasi AYO!
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-red-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Lebih dari 10000 tim terdaftar sebagai lawan main.</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-red-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Mencakup tim dari seluruh wilayah di Indonesia.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SparringSection