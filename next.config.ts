import type { NextConfig } from "next";  
  
const nextConfig: NextConfig = {  
  images: {  
    domains: ['ayo.co.id'],  
  },  
  // other config options here  
  reactStrictMode: true,  
  swcMinify: true,  
};  
  
export default nextConfig;  
