/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'
import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Mail, Eye, MoreVertical, CheckCircle, Clock, XCircle, Trash2, MessageSquare, Tag, RefreshCw } from 'lucide-react';

import { 
  useGetAllInquiries, 
  useInquiryStats, 
  useUpdateInquiryStatus, 
  useAddInquiryNote, 
  useDeleteInquiry, 
  useBulkInquiryAction,
  useExportInquiries 
} from '../../../hooks/useInquiry';
import { Inquiry } from '@/types/inquiry';

const InquiriesManagement: React.FC = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedInquiries, setSelectedInquiries] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showNoteModal, setShowNoteModal] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');

  // API hooks
  const { data: inquiriesData, isLoading, error, isError, refetch } = useGetAllInquiries({
    status: statusFilter === 'all' ? undefined : statusFilter,
    sortBy: sortBy === 'newest' ? 'createdAt' : sortBy,
    sortOrder: sortBy === 'newest' ? 'desc' : 'asc'
  });
  
  const { data: statsData, isLoading: statsLoading } = useInquiryStats();
  const updateStatusMutation = useUpdateInquiryStatus();
  const addNoteMutation = useAddInquiryNote();
  const deleteInquiryMutation = useDeleteInquiry();
  const bulkActionMutation = useBulkInquiryAction();
  const exportMutation = useExportInquiries();

  const stats = statsData?.stats || {
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    byStatus: { pending: 0, contacted: 0, closed: 0 },
    byPriority: { low: 0, medium: 0, high: 0 },
    overdue: 0
  };

  // Filter and sort inquiries - moved inquiriesList inside useMemo
  const filteredInquiries = useMemo(() => {
    const inquiriesList = inquiriesData?.inquiries || [];
    
    const filtered = inquiriesList.filter((inquiry: Inquiry) => {
      const matchesSearch = 
        inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.artworkTitle?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || inquiry.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && !inquiry.archived;
    });

    // Sort inquiries
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

    return filtered;
  }, [inquiriesData?.inquiries, searchTerm, statusFilter, priorityFilter, sortBy]);

  // Handle inquiry selection
  const handleInquirySelect = (inquiryId: string) => {
    const newSelected = new Set(selectedInquiries);
    if (newSelected.has(inquiryId)) {
      newSelected.delete(inquiryId);
    } else {
      newSelected.add(inquiryId);
    }
    setSelectedInquiries(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedInquiries.size === filteredInquiries.length) {
      setSelectedInquiries(new Set());
      setShowBulkActions(false);
    } else {
      const allIds = new Set(filteredInquiries.map((inquiry: Inquiry) => inquiry._id));
      setSelectedInquiries(allIds);
      setShowBulkActions(true);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (inquiryId: string, status: 'pending' | 'contacted' | 'closed') => {
    try {
      await updateStatusMutation.mutateAsync({
        inquiryId,
        statusData: { status }
      });
      setOpenDropdown(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Handle note addition
  const handleAddNote = async (inquiryId: string) => {
    if (!newNote.trim()) return;
    
    try {
      await addNoteMutation.mutateAsync({
        inquiryId,
        noteData: { note: newNote }
      });
      setShowNoteModal(null);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Handle delete inquiry
  const handleDeleteInquiry = async (inquiryId: string) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await deleteInquiryMutation.mutateAsync(inquiryId);
        setOpenDropdown(null);
      } catch (error) {
        console.error('Error deleting inquiry:', error);
      }
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: 'delete' | 'update-status' | 'archive', status?: 'pending' | 'contacted' | 'closed') => {
    const inquiryIds = Array.from(selectedInquiries);
    
    if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${inquiryIds.length} inquiries?`)) {
      return;
    }

    try {
      await bulkActionMutation.mutateAsync({
        action,
        inquiryIds,
        status
      });
      setSelectedInquiries(new Set());
      setShowBulkActions(false);
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync({
        status: statusFilter === 'all' ? undefined : statusFilter
      });
    } catch (error) {
      console.error('Error exporting inquiries:', error);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      contacted: { icon: CheckCircle, color: 'bg-blue-100 text-blue-800 border-blue-200' },
      closed: { icon: XCircle, color: 'bg-green-100 text-green-800 border-green-200' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: string }) => {
    const priorityConfig = {
      low: { color: 'bg-gray-100 text-gray-800 border-gray-200' },
      medium: { color: 'bg-orange-100 text-orange-800 border-orange-200' },
      high: { color: 'bg-red-100 text-red-800 border-red-200' }
    };

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
        {priority}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-20 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <div className="text-red-500 text-lg font-medium mb-2">
                Error Loading Inquiries
              </div>
              <p className="text-gray-600 mb-4">
                {error instanceof Error ? error.message : 'Failed to load inquiries'}
              </p>
              <button 
                onClick={() => refetch()} 
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6" onClick={(e) => {
      if (!(e.target as Element).closest('.relative')) {
        setOpenDropdown(null);
      }
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Inquiries Management</h1>
              <p className="text-gray-600 mt-1">Manage and track all artwork inquiries</p>
            </div>
            
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-600">Total</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.byStatus.pending}</div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.byStatus.contacted}</div>
              <div className="text-sm text-blue-600">Contacted</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.byStatus.closed}</div>
              <div className="text-sm text-green-600">Closed</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.thisMonth}</div>
              <div className="text-sm text-orange-600">This Month</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="all">All Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
              <option value="priority">Priority</option>
            </select>

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={exportMutation.isPending}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Download size={20} />
              {exportMutation.isPending ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-800">
                {selectedInquiries.size} inquiries selected
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleBulkAction('update-status', 'contacted')}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Mark as Contacted
                </button>
                <button 
                  onClick={() => handleBulkAction('update-status', 'closed')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Mark as Closed
                </button>
                <button 
                  onClick={() => handleBulkAction('archive')}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                >
                  Archive
                </button>
                <button 
                  onClick={() => handleBulkAction('delete')}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Inquiries List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Table Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedInquiries.size === filteredInquiries.length && filteredInquiries.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-gray-600 focus:ring-gray-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {filteredInquiries.length} {filteredInquiries.length === 1 ? 'inquiry' : 'inquiries'}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="divide-y divide-gray-200">
            {filteredInquiries.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No inquiries found</div>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'There are no inquiries to display at this time.'}
                </p>
              </div>
            ) : (
              filteredInquiries.map((inquiry: Inquiry) => {
                const isSelected = selectedInquiries.has(inquiry._id);
                const isExpanded = expandedInquiry === inquiry._id;

                return (
                  <div key={inquiry._id} className={`p-6 hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleInquirySelect(inquiry._id)}
                        className="mt-1 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold text-gray-800">
                              {inquiry.name}
                            </h3>
                            <StatusBadge status={inquiry.status} />
                            <PriorityBadge priority={inquiry.priority} />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">
                              {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => window.open(`mailto:${inquiry.email}`)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Send Email"
                              >
                                <Mail size={16} />
                              </button>
                              
                              <button
                                onClick={() => setExpandedInquiry(isExpanded ? null : inquiry._id)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="View Full Details"
                              >
                                <Eye size={16} />
                              </button>
                              
                              <div className="relative">
                                <button 
                                  onClick={() => setOpenDropdown(openDropdown === inquiry._id ? null : inquiry._id)}
                                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                  title="More Actions"
                                >
                                  <MoreVertical size={16} />
                                </button>
                                
                                {/* Dropdown Menu */}
                                {openDropdown === inquiry._id && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                                    <div className="py-1">
                                      <button
                                        onClick={() => handleStatusUpdate(inquiry._id, 'contacted')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                                      >
                                        <CheckCircle size={16} />
                                        Mark as Contacted
                                      </button>
                                      <button
                                        onClick={() => handleStatusUpdate(inquiry._id, 'closed')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-2"
                                      >
                                        <XCircle size={16} />
                                        Mark as Closed
                                      </button>
                                      <button
                                        onClick={() => setShowNoteModal(inquiry._id)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <MessageSquare size={16} />
                                        Add Note
                                      </button>
                                      <hr className="my-1" />
                                      <button
                                        onClick={() => handleDeleteInquiry(inquiry._id)}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      >
                                        <Trash2 size={16} />
                                        Delete Inquiry
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={16} />
                            <span>{inquiry.email}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Tag size={16} />
                            <span><strong>Artwork:</strong> {inquiry.artworkTitle} (ID: {inquiry.artworkId})</span>
                          </div>

                          {inquiry.tags.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">Tags:</span>
                              <div className="flex gap-1">
                                {inquiry.tags.map((tag, index) => (
                                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {inquiry.adminNote && (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <MessageSquare size={16} className="mt-0.5" />
                              <div>
                                <span className="font-medium">Admin Note:</span>
                                <p className="mt-1 text-gray-700">{inquiry.adminNote}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Message Preview */}
                        <div className="mt-3">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare size={16} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">Message:</span>
                          </div>
                          <p className={`text-gray-600 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
                            {inquiry.message}
                          </p>
                          {inquiry.message && inquiry.message.length > 150 && (
                            <button
                              onClick={() => setExpandedInquiry(isExpanded ? null : inquiry._id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1"
                            >
                              {isExpanded ? 'Show Less' : 'Read More'}
                            </button>
                          )}
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">Inquiry Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div><strong>Full Name:</strong> {inquiry.name}</div>
                                  <div><strong>Email:</strong> {inquiry.email}</div>
                                  <div><strong>Artwork ID:</strong> {inquiry.artworkId}</div>
                                  <div><strong>Artwork Title:</strong> {inquiry.artworkTitle}</div>
                                  <div><strong>Priority:</strong> <PriorityBadge priority={inquiry.priority} /></div>
                                  <div><strong>Status:</strong> <StatusBadge status={inquiry.status} /></div>
                                  <div><strong>Submitted:</strong> {new Date(inquiry.createdAt).toLocaleString()}</div>
                                  {inquiry.lastContactedAt && (
                                    <div><strong>Last Contacted:</strong> {new Date(inquiry.lastContactedAt).toLocaleString()}</div>
                                  )}
                                </div>
                              </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">Message Details</h4>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <p className="text-sm text-gray-700 leading-relaxed">
                                    {inquiry.message}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium text-gray-700 mb-2">Actions</h4>
                                <div className="space-y-2">
                                  <button
                                    onClick={() => window.open(`mailto:${inquiry.email}`)}
                                    className="w-full flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                  >
                                    <Mail size={16} />
                                    Send Email
                                  </button>
                                  <button
                                    onClick={() => setShowNoteModal(inquiry._id)}
                                    className="w-full flex items-center gap-2 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                  >
                                    <MessageSquare size={16} />
                                    Add Note
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Note</h3>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Enter your note here..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowNoteModal(null);
                    setNewNote('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddNote(showNoteModal)}
                  disabled={!newNote.trim() || addNoteMutation.isPending}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  {addNoteMutation.isPending ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesManagement;