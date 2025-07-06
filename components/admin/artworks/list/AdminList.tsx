/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import React, { useState } from 'react';
import { useArtworks, useArtworkManager } from '@/hooks/useArtwork';
import { ArtworkCard } from '../card/ArtworkCards';
import { ArtworkForm } from '../form/ArtworkForn';
import { ArtworkImageManager } from '../imageManager/ImageManager';
import { ArtworkDetailModal } from '../modal/ArtModal';
import { ArtworkResponse } from '@/types/artwork';
import { Plus, Search, Filter} from 'lucide-react';

interface ArtworkListProps {
  isCreating?: boolean;
  isUpdating?: boolean;
}

export const ArtworkList: React.FC<ArtworkListProps> = ({
  isCreating = false,
  isUpdating = false,
}) => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    category: '',
    featured: undefined as boolean | undefined,
    sold: undefined as boolean | undefined,
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<ArtworkResponse | null>(null);
  const [viewingArtwork, setViewingArtwork] = useState<ArtworkResponse | null>(null);
  const [managingImagesArtwork, setManagingImagesArtwork] = useState<ArtworkResponse | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const { 
    data: artworksData, 
    isLoading, 
    error, 
  } = useArtworks(filters);
  
  const { 
    createArtwork, 
    updateArtwork, 
    deleteArtwork, 
    isDeleting 
  } = useArtworkManager();

  React.useEffect(() => {
    console.log('Artworks Data:', artworksData);
    if (artworksData?.artworks) {
      console.log('Artworks Array:', artworksData.artworks);
    }
    console.log('Editing Artwork:', editingArtwork);
  }, [artworksData, editingArtwork]);

  const handleEdit = (artwork: ArtworkResponse) => {
  console.log('Setting editingArtwork:', artwork);
  if (!artwork.id) { // Changed from artwork.id to artwork._id
    console.error('Artwork has no ID:', artwork);
    alert('Error: Cannot edit artwork. Missing ID.');
    return;
  }
  setEditingArtwork(artwork);
  setShowForm(true);
  setViewingArtwork(null);
  setManagingImagesArtwork(null);
};

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      deleteArtwork(id);
    }
  };

  const handleView = (artwork: ArtworkResponse) => {
    setViewingArtwork(artwork);
    setShowForm(false);
    setManagingImagesArtwork(null);
  };

  const handleManageImages = (artwork: ArtworkResponse) => {
    setManagingImagesArtwork(artwork);
    setShowForm(false);
    setViewingArtwork(null);
  };

  const handleFormSubmit = (formData: FormData) => {
    if (editingArtwork) {
      if (!editingArtwork.id) { // Change from editingArtwork.id to editingArtwork._id
        console.error('Editing artwork ID is undefined:', editingArtwork);
        alert('Error: Cannot update artwork. Invalid artwork ID.');
        return;
      }
      console.log('Updating artwork with ID:', editingArtwork.id);
      updateArtwork({ id: editingArtwork.id, artworkData: formData }); // Change to _id
    } else {
      console.log('Creating new artwork');
      createArtwork(formData);
    }
    setShowForm(false);
    setEditingArtwork(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingArtwork(null);
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const artworksToDisplay = artworksData?.artworks?.filter(artwork =>
    artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artwork.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading artworks: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Artwork Management</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
            disabled={isCreating}
          >
            <Plus size={20} />
            {isCreating ? 'Creating...' : 'Create New Artwork'}
          </button>
        </div>
      </div>

      {/* {debugMode && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Debug Info</h3>
          <pre className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md overflow-auto">
            {JSON.stringify(artworksData, null, 2) || 'No data received'}
          </pre>
        </div>
      )} */}

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  <option value="portraits">Portraits</option>
                  <option value="landscapes">Landscapes</option>
                  <option value="still-life">Still Life</option>
                  <option value="sketches">Sketches</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured
                </label>
                <select
                  value={filters.featured?.toString() || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    featured: e.target.value === '' ? undefined : e.target.value === 'true'
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="true">Featured</option>
                  <option value="false">Not Featured</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.sold?.toString() || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    sold: e.target.value === '' ? undefined : e.target.value === 'true'
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="false">Available</option>
                  <option value="true">Sold</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Per Page
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Artworks</h3>
          <p className="text-2xl font-bold text-gray-800">{artworksData?.total || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Featured</h3>
          <p className="text-2xl font-bold text-gray-800">
            {artworksToDisplay.filter(a => a.featured).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Available</h3>
          <p className="text-2xl font-bold text-gray-800">
            {artworksToDisplay.filter(a => !a.sold).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Sold</h3>
          <p className="text-2xl font-bold text-gray-800">
            {artworksToDisplay.filter(a => a.sold).length}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading artworks...</p>
        </div>
      ) : (
        <>
          {artworksToDisplay.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No artworks found. Try refreshing or adjusting filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artworksToDisplay.map(artwork => (
                <ArtworkCard
                  key={artwork.id} // Changed from artwork.id to artwork._id
                  artwork={artwork}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                  isDeleting={isDeleting}
                />
              ))}
            </div>
          )}

          {artworksData && artworksData.totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {filters.page} of {artworksData.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === artworksData.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showForm && (
        <ArtworkForm
          artwork={editingArtwork || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isCreating || isUpdating}
          mode={editingArtwork ? 'edit' : 'create'}
        />
      )}

      {viewingArtwork && (
        <ArtworkDetailModal
          artwork={viewingArtwork}
          onClose={() => setViewingArtwork(null)}
          onEdit={handleEdit}
          onManageImages={handleManageImages}
        />
      )}

      {managingImagesArtwork && (
        <ArtworkImageManager
          artwork={managingImagesArtwork}
          onClose={() => setManagingImagesArtwork(null)}
        />
      )}
    </div>
  );
};