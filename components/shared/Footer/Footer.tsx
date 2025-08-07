'use client'
import { Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/work' },
    { name: 'About Me', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Exhibitions', href: '/exhibitions' }
  ];

  // Hide footer on admin routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/invoice')) {
    return null;
  }

  return (
    <footer id="contact" className="bg-white py-16 ">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-6">
          {/* <h3 className="text-lg font-light text-gray-900 mb-6 text-center">Links</h3> */}
          <div className="flex flex-wrap justify-center items-center gap-6">
            {quickLinks.map((link, index) => (
              <div key={link.name} className="flex items-center">
                <a
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-300 text-sm font-light"
                >
                  {link.name}
                </a>
                {index < quickLinks.length - 1 && (
                  <span className="ml-6 text-gray-300">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
       
        {/* Bottom Bar */}  
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-600 text-sm font-light">
              © {new Date().getFullYear()} Joshua Otuonye. All rights reserved.
            </div>
           
            <div className="flex items-center space-x-2 text-[10px] text-gray-600 font-light">
              <span>
                <a href="https://dabsmanuel.netlify.app" className="hover:text-gray-900 transition-colors duration-300">
                  Crafted by juniorForge with
                </a>
              </span>
              <Heart className="w-2 h-2  text-gray-900" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;