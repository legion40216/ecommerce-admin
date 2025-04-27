/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'wuaykdudinfkzajnueaq.supabase.co',
              port: '', // Optional: leave empty if no specific port
              pathname: '/**', // Allows all paths, adjust if necessary
          },
      ],
  },
};
    //cloundry settings
    // images:{
    //     domains:[
    //         "res.cloudinary.com"
    //     ]
    // }

export default nextConfig;