'use client'
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LuFacebook, LuInstagram } from 'react-icons/lu';
import { FaXTwitter, FaTiktok } from 'react-icons/fa6';

const studioLinks = [
  { name: 'Home', href: '/' },
  { name: 'Portfolio', href: '/work' },
  { name: 'About Me', href: '/about' },
  { name: 'Exhibitions', href: '/exhibitions' },
  { name: 'Contact', href: '/contact' }
];

const commissionLinks = [
  { name: 'Portrait commissions', href: '/portraits-commission' },
  { name: 'Pet commissions', href: '/pet-commissions' },
  { name: 'Original artwork', href: '/original-artwork' }
];

const socialLinks = [
  { icon: LuInstagram, label: 'Instagram', href: 'https://www.instagram.com/joc_arts?igsh=MXZ0NWw2eTE3bWc3dg%3D%3D&utm_source=qr' },
  { icon: LuFacebook, label: 'Facebook', href: 'https://www.facebook.com/share/1AYRhXUtQH/?mibextid=wwXIfr' },
  { icon: FaXTwitter, label: 'Twitter', href: 'https://x.com/skye_worldwide1?s=21' },
  { icon: FaTiktok, label: 'TikTok', href: 'https://www.tiktok.com/@skye_worldwide?_t=ZM-8xZpNt2GNZl&_r=1' }
];

const Footer = () => {
  const pathname = usePathname();

  // Hide footer on admin routes
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/invoice')) {
    return null;
  }

  return (
    <footer id="contact" className="bg-charcoal text-mat">
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 lg:px-10 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="label !text-mat/55">Commissions open</p>
            <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.05] sm:text-5xl">
              Have someone worth drawing?
            </h2>
            <p className="mt-5 max-w-md text-mat/65">
              Portrait commissions typically take 4–6 weeks. Send a photo and a few words about them.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-block bg-mat px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-white"
            >
              Start a commission
            </Link>
          </div>

          <nav className="grid grid-cols-2 gap-10 lg:col-span-6 lg:pl-10" aria-label="Footer">
            <div>
              <p className="label mb-5 !text-mat/55">Studio</p>
              <ul className="space-y-3 text-sm">
                {studioLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-mat/80 transition-colors hover:text-white">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label mb-5 !text-mat/55">Commission</p>
              <ul className="space-y-3 text-sm">
                {commissionLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-mat/80 transition-colors hover:text-white">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center border border-white/20 transition-colors hover:bg-mat hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>

          <p className="label !text-mat/55">
            © {new Date().getFullYear()} Joshua Otuonye · Luton, UK
          </p>

          <a
            href="https://dabsmanuel.netlify.app"
            className="flex items-center gap-2 text-[11px] text-mat/50 transition-colors hover:text-mat"
          >
            Crafted by juniorForge with
            <Heart className="h-2.5 w-2.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
