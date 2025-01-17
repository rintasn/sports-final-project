import Image from 'next/image';  

const Footer = () => {
    return (
      <footer className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="col-span-1 lg:col-span-2">
              <Image src="/logo-ayo.svg" alt="AYO Logo" width={120} height={40} />
              <p className="mt-4 text-sm text-gray-600">PT Ayo Indonesia Maju</p>
              <p className="text-sm text-gray-600">Jl. Wahid Hasyim No. 10D</p>
              <p className="text-sm text-gray-600">Jakarta Pusat 10340</p>
              <p className="text-sm text-gray-600">DKI Jakarta, Indonesia</p>
              <p className="mt-2 text-sm text-gray-600">+62878-8562-3838</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Perusahaan</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-red-800">Tentang</a></li>
                <li><a href="#" className="text-gray-600 hover:text-red-800">Kebijakan & Privasi</a></li>
                <li><a href="#" className="text-gray-600 hover:text-red-800">Syarat dan Ketentuan</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Ekosistem</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-red-800">Sparring</a></li>
                <li><a href="#" className="text-gray-600 hover:text-red-800">Main Bareng</a></li>
                <li><a href="#" className="text-gray-600 hover:text-red-800">Direktori Tim</a></li>
                <li><a href="#" className="text-gray-600 hover:text-red-800">Direktori Lapangan</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Unduh Aplikasi</h3>
              <div className="flex flex-col gap-2">
                <a href="#" className="hover:opacity-80">
                  <Image src="/google-play.png" alt="Google Play" width={120} height={40} />
                </a>
                <a href="#" className="hover:opacity-80">
                  <Image src="/app-store.png" alt="App Store" width={120} height={40} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">© 2023 AYO Indonesia All Right Reserved</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <a href="#" className="text-gray-600 hover:text-red-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-red-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-red-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18.5a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17z"/>
                    <path d="M14.5 9a2.5 2.5 0 0 0-5 0v6a2.5 2.5 0 0 0 5 0V9zm-2.5-1a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-3 0v-6A1.5 1.5 0 0 1 12 8z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-600 hover:text-red-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  export default Footer