'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { LuFacebook, LuInstagram } from "react-icons/lu";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";


interface HeaderProps {
  isScrolled: boolean;
}

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Work', path: '/work' },
  { name: 'About', path: '/about' },
  { name: 'Exhibitions', path: '/exhibitions' },
  { name: 'Contact', path: '/contact' }
];

const socialLinks = [
  { icon: LuInstagram, label: 'Instagram', href: 'https://www.instagram.com/joc_arts?igsh=MXZ0NWw2eTE3bWc3dg%3D%3D&utm_source=qr' },
  { icon: LuFacebook, label: 'Facebook', href: 'https://www.facebook.com/share/1AYRhXUtQH/?mibextid=wwXIfr' },
  { icon: FaXTwitter, label: 'Twitter', href: 'https://x.com/skye_worldwide1?s=21' },
  { icon: FaTiktok, label: 'TikTok', href: 'https://www.tiktok.com/@skye_worldwide?_t=ZM-8xZpNt2GNZl&_r=1' }
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname?.startsWith(path);

  const toggleMenu = () => setIsMenuOpen((open) => !open);

  // Close the menu whenever the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Slide the bar away on scroll down, bring it back on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setHasScrolled(currentScrollY > 24);

      if (Math.abs(currentScrollY - lastScrollY) < 10) return;

      if (currentScrollY < lastScrollY) {
        setIsHidden(false);
      } else if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsHidden(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Prevent scrolling when menu is open; close on Escape
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen]);

  // Hide header on admin routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/invoice')) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-transform duration-500 ${
          isHidden && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${hasScrolled ? 'bg-wall/90 backdrop-blur-md border-b border-rule' : 'bg-transparent border-b border-transparent'}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-10">
          <Link href="/" className="group flex items-baseline gap-3" aria-label="Joshua Otuonye, home">
            <span className="font-display text-lg font-semibold tracking-tight text-ink lg:text-xl">
              Joshua Otuonye
            </span>
            <span className="label hidden sm:inline">JOC Arts</span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
            {navItems.filter((item) => item.path !== '/').map((item) => (
              <Link
                key={item.name}
                href={item.path}
                aria-current={isActive(item.path) ? 'page' : undefined}
                className={`relative py-1 text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-ink after:transition-transform after:duration-300 ${
                  isActive(item.path)
                    ? 'text-ink after:scale-x-100'
                    : 'text-lead hover:text-ink after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/portraits-commission"
              className="border border-ink px-4 py-2 text-sm text-ink transition-colors hover:bg-ink hover:text-mat"
            >
              Commission a portrait
            </Link>
          </nav>

          <button
            onClick={toggleMenu}
            className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <span className="relative block h-3 w-6">
              <span className="absolute left-0 top-0 h-px w-6 bg-ink" />
              <span className="absolute bottom-0 left-0 h-px w-6 bg-ink" />
            </span>
          </button>
        </div>
      </header>

      {/* Full-screen menu (small screens) */}
      <div
        className={`fixed inset-0 z-50 bg-charcoal text-mat transition-all duration-500 lg:hidden ${
          isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex h-16 items-center justify-between px-6">
          <span className="font-display text-lg font-semibold">Joshua Otuonye</span>
          <button
            onClick={toggleMenu}
            className="-mr-2 flex h-11 w-11 items-center justify-center"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(100%-4rem)] flex-col justify-between px-6 pb-10 pt-6">
          <nav aria-label="Mobile">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-baseline justify-between border-b border-white/10 py-5 font-display text-4xl font-semibold transition-all duration-500 ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                } ${isActive(item.path) ? 'text-mat' : 'text-mat/60 hover:text-mat'}`}
                style={{ transitionDelay: isMenuOpen ? `${index * 70 + 150}ms` : '0ms' }}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/portraits-commission"
              onClick={() => setIsMenuOpen(false)}
              className="mt-8 inline-block border border-mat/60 px-5 py-3 text-sm hover:bg-mat hover:text-ink"
            >
              Commission a portrait
            </Link>
          </nav>

          <div className="flex gap-3">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center border border-white/25 transition-colors hover:bg-mat hover:text-ink"
                  aria-label={social.label}
                >
                  <IconComponent className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
