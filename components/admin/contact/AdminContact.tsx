'use client'

import React, { useState } from 'react';
import { Search, Mail, Clock, AlertCircle, User, Calendar, MessageCircle, Tag } from 'lucide-react';
import { useContact } from '../../../hooks/useContact';
import { Contact } from '../../../types/contact';

const ContactAdminDashboard: React.FC = () => {
  const { 
    contacts, 
    isLoading: contactsLoading, 
    contactsError, 
    updateContact, 
    isUpdateLoading 
  } = useContact();
  
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<string>('all');

  const getStatusIcon = (status: Contact['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'read':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'closed':
        return <AlertCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'read':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'closed':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    const matchesInquiryType = inquiryTypeFilter === 'all' || contact.inquiryType === inquiryTypeFilter;
    
    return matchesSearch && matchesStatus && matchesInquiryType;
  });

  const uniqueInquiryTypes = [...new Set(contacts.map(contact => contact.inquiryType))];

  const handleUpdateStatus = (status: Contact['status']) => {
    if (selectedContact) {
      updateContact({ 
        id: selectedContact._id, 
        data: { status } 
      });
    }
  };

  if (contactsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-200 border-t-slate-600 mx-auto"></div>
            <Mail className="w-6 h-6 text-slate-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-slate-600 font-medium">Loading contacts...</p>
        </div>
      </div>
    );
  }

  if (contactsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Contacts</h3>
          <p className="text-red-600 mb-6">{contactsError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Contact Management</h1>
              <p className="text-slate-600">Manage and respond to customer inquiries</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-slate-600">
                {contacts.filter(c => c.status === 'pending').length} Pending
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-slate-600">
                {contacts.filter(c => c.status === 'read').length} Read
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-slate-600">
                {contacts.filter(c => c.status === 'closed').length} Closed
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-700 placeholder-slate-400"
              /> 
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-700 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="read">Read</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={inquiryTypeFilter}
              onChange={(e) => setInquiryTypeFilter(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-700 bg-white"
            >
              <option value="all">All Types</option>
              {uniqueInquiryTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contact List */}
        <div className={`transition-all duration-300 ${selectedContact ? 'grid grid-cols-1 xl:grid-cols-5 gap-6' : ''}`}>
          <div className={selectedContact ? 'xl:col-span-2' : ''}>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Inquiries ({filteredContacts.length})
                </h2>
              </div>
              
              <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-6 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50 ${
                      selectedContact?._id === contact._id
                        ? 'bg-slate-50 border-r-4 border-r-slate-600'
                        : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-slate-900 truncate">{contact.name}</h3>
                          <p className="text-sm text-slate-600 truncate">{contact.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {getStatusIcon(contact.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(contact.status)}`}>
                          {contact.status}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-medium text-slate-900 mb-2 line-clamp-2">{contact.subject}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {contact.inquiryType}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredContacts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No contacts found</p>
                    <p className="text-sm text-slate-400">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details - Only shown when contact is selected */}
          {selectedContact && (
            <div className="xl:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-slate-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-slate-900">{selectedContact.name}</h2>
                        <p className="text-slate-600">{selectedContact.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-500">
                            {new Date(selectedContact.createdAt).toLocaleDateString()} at{' '}
                            {new Date(selectedContact.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedContact.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedContact.status)}`}>
                          {selectedContact.status}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedContact(null)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Close details"
                      >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <p className="text-slate-900">{selectedContact.subject}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Inquiry Type</label>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <p className="text-slate-900">{selectedContact.inquiryType}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <p className="text-slate-900 whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>
                  
                  {selectedContact.response && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Previous Response</label>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-slate-900 whitespace-pre-wrap">{selectedContact.response}</p>
                      </div>
                    </div>
                  )}

                  {/* Status Update and Email Action */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h3 className="font-medium text-slate-900 mb-4">Actions</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Update Status</label>
                        <div className="flex flex-wrap gap-2">
                          {(['pending', 'read', 'closed'] as const).map((status) => (
                            <button
                              key={status}
                              onClick={() => handleUpdateStatus(status)}
                              disabled={isUpdateLoading || selectedContact.status === status}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                selectedContact.status === status
                                  ? 'bg-slate-700 text-white'
                                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Send Response</label>
                        <a
                          href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          <Mail className="w-4 h-4" />
                          Reply via Email
                        </a>
                        <p className="text-xs text-slate-500 mt-1">Opens your default email client</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactAdminDashboard;