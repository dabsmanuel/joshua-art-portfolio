'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import { useArtworks } from '../../../hooks/useArtwork';
import { useGetAllInquiries, useInquiryStats } from '../../../hooks/useInquiry';
import { useGetAllContacts } from '../../../hooks/useContact';
import { useExhibitions } from '../../../hooks/useExhibition';
import { Palette, Landmark, MessageSquare, Inbox, Plus } from 'lucide-react';

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const DashboardContent: React.FC = () => {
  const { user } = useAuth();

  // limit: 1 is enough here, the response still carries the total
  const { data: allArtworks } = useArtworks({ limit: 1 });
  const { data: featuredArtworks } = useArtworks({ featured: true, limit: 1 });
  const { data: soldArtworks } = useArtworks({ sold: true, limit: 1 });
  const { data: inquiryStats } = useInquiryStats();
  const { data: recentInquiries } = useGetAllInquiries({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' });
  const { data: contactsData } = useGetAllContacts();
  const { data: exhibitions } = useExhibitions();

  const contacts = contactsData?.contacts ?? [];
  const pendingContacts = contacts.filter((c) => c.status === 'pending').length;
  const pendingInquiries = inquiryStats?.stats?.byStatus?.pending ?? 0;

  const cards = [
    {
      label: 'Artworks',
      value: allArtworks?.total ?? 0,
      note: `${featuredArtworks?.total ?? 0} featured, ${soldArtworks?.total ?? 0} sold`,
      icon: Palette,
      href: '/admin/artworks',
    },
    {
      label: 'Exhibitions',
      value: exhibitions?.length ?? 0,
      note: 'Listed on the site',
      icon: Landmark,
      href: '/admin/exhibitions',
    },
    {
      label: 'Artwork inquiries',
      value: inquiryStats?.stats?.total ?? 0,
      note: `${pendingInquiries} pending`,
      icon: MessageSquare,
      href: '/admin/inquiries',
    },
    {
      label: 'Contact requests',
      value: contacts.length,
      note: `${pendingContacts} pending`,
      icon: Inbox,
      href: '/admin/contact',
    },
  ];

  const inquiries = recentInquiries?.inquiries ?? [];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName || user?.name || 'Admin'}</h2>
        <p className="text-gray-300">
          {pendingInquiries + pendingContacts > 0
            ? `You have ${pendingInquiries} pending artwork ${pendingInquiries === 1 ? 'inquiry' : 'inquiries'} and ${pendingContacts} pending contact ${pendingContacts === 1 ? 'request' : 'requests'}.`
            : 'You are all caught up. There is nothing waiting for a reply.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-gray-400 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <card.icon className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{card.note}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent inquiries */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Latest artwork inquiries</h3>
            <Link href="/admin/inquiries" className="text-sm text-gray-600 underline underline-offset-4 hover:text-gray-900">
              View all
            </Link>
          </div>
          {inquiries.length === 0 ? (
            <p className="text-gray-500 text-sm">No inquiries yet. They appear here when a visitor asks about a piece.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {inquiries.map((inquiry) => (
                <li key={inquiry._id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {inquiry.name} <span className="text-gray-500 font-normal">about {inquiry.artworkTitle}</span>
                    </p>
                    <p className="text-sm text-gray-500 truncate">{inquiry.message}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-500">{formatDate(inquiry.createdAt)}</p>
                    <p className="text-xs font-medium text-gray-700 capitalize">{inquiry.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/artworks"
              className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Add an artwork</span>
            </Link>
            <Link
              href="/admin/exhibitions"
              className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Add an exhibition</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Palette className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">View the public site</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
