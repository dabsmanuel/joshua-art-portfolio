'use client';

import React, { useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useInquiryStats } from '../../hooks/useInquiry';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  Palette,
  Landmark,
  MessageSquare,
  Inbox,
  LogOut,
  User,
  Bell,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/admin/dashboard' },
  { id: 'artworks', label: 'Artwork', icon: Palette, href: '/admin/artworks' },
  { id: 'exhibitions', label: 'Exhibitions', icon: Landmark, href: '/admin/exhibitions' },
  { id: 'inquiries', label: 'Artwork inquiries', icon: MessageSquare, href: '/admin/inquiries' },
  { id: 'contact', label: 'Contact requests', icon: Inbox, href: '/admin/contact' },
  { id: 'profile', label: 'Profile', icon: User, href: '/admin/profile' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, pageTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  // Defer client-only auth checks until after first paint so the server
  // and client start with identical HTML (no loading spinner on the server).
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout, isLogoutLoading, isLoading } = useAuth();
  const { data: inquiryStats } = useInquiryStats();
  const pendingInquiries = inquiryStats?.stats?.byStatus?.pending ?? 0;
  const router = useRouter();
  const pathname = usePathname();

  // Redirect if not authenticated
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, mounted, router]);

  const isMenuItemActive = (item: MenuItem): boolean =>
    pathname === item.href || pathname.startsWith(item.href + '/');

  // The title follows the page unless a page asks for its own
  const title = pageTitle ?? menuItems.find(isMenuItemActive)?.label ?? 'Admin';

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setSidebarOpen(false);
    setUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen && !(event.target as Element).closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Lock page scroll while the mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-wall" role="status">
        <div className="text-center">
          <div className="mx-auto mb-4 h-7 w-7 animate-spin rounded-full border border-ink border-t-transparent" />
          <p className="label">Loading…</p>
        </div>
      </div>
    );
  }

  // The effect above redirects to the login page
  if (!isAuthenticated) {
    return null;
  }

  const displayName = user?.name || user?.email || 'Admin';

  return (
    <div className="flex min-h-screen bg-wall text-ink">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col bg-charcoal text-mat transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Admin navigation"
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/admin/dashboard" className="block leading-tight">
            <span className="block font-display text-lg font-semibold">Joshua Otuonye</span>
            <span className="label !text-mat/50">Studio admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-mat/70 hover:text-mat lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = isMenuItemActive(item);
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left text-sm transition-colors ${
                      isActive
                        ? 'border-mat bg-white/[0.06] text-mat'
                        : 'border-transparent text-mat/65 hover:bg-white/[0.04] hover:text-mat'
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.id === 'inquiries' && pendingInquiries > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-dot px-1.5 text-xs text-white">
                        {pendingInquiries}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/10 p-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 flex items-center gap-2 px-2 text-sm text-mat/65 hover:text-mat"
          >
            <ExternalLink className="h-4 w-4" />
            View public site
          </a>
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mat text-ink">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="label !text-mat/50">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col lg:ml-64">
        <header className="sticky top-0 z-30 shrink-0 border-b border-rule bg-wall/90 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="-ml-2 p-2 text-lead hover:text-ink lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Pending inquiries */}
              <button
                onClick={() => handleNavigation('/admin/inquiries')}
                className="relative p-2 text-lead hover:text-ink"
                aria-label={pendingInquiries > 0 ? `${pendingInquiries} pending inquiries` : 'No pending inquiries'}
                title={pendingInquiries > 0 ? `${pendingInquiries} pending inquiries` : 'No pending inquiries'}
              >
                <Bell className="h-5 w-5" />
                {pendingInquiries > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-dot px-1 text-xs text-white">
                    {pendingInquiries}
                  </span>
                )}
              </button>

              {/* User menu */}
              <div className="user-menu relative">
                <button
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="flex items-center gap-2 p-1.5 text-lead hover:text-ink"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-mat">
                    <User className="h-4 w-4" />
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 w-56 border border-rule bg-mat py-1 shadow-lg"
                  >
                    <div className="border-b border-rule px-4 py-3">
                      <p className="truncate text-sm font-medium">{displayName}</p>
                      <p className="truncate text-xs text-lead">{user?.email}</p>
                    </div>
                    <button
                      role="menuitem"
                      onClick={() => handleNavigation('/admin/profile')}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink hover:bg-gray-100"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </button>
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      disabled={isLogoutLoading}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-dot hover:bg-dot/10 disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />
                      {isLogoutLoading ? 'Signing out…' : 'Sign out'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
