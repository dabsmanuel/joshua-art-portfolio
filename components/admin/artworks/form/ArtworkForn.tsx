'use client'

import React, { useEffect, useState } from 'react';
import { ArtworkResponse } from '@/types/artwork';
import { X, Loader2 } from 'lucide-react';

interface ArtworkFormProps {
  artwork?: ArtworkResponse;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

export const ArtworkForm: React.FC<ArtworkFormProps> = ({
  artwork,
  onSubmit,
  onCancel,
  isLoading,
  mode,
}) => {
  const [formData, setFormData] = useState({
    title: artwork?.title || '',
    description: artwork?.description || '',
    category: artwork?.category || '',
    medium: artwork?.medium || '',
    dimensions: artwork?.dimensions || '',
    year: artwork?.year?.toString() || '',
    price: artwork?.price ? String(artwork.price) : '',
    tags: artwork?.tags?.map(tag => tag.replace(/[\[\]"]+/g, '')).join(', ') || '',
    featured: artwork?.featured ? 'true' : 'false',
    sold: artwork?.sold ? 'true' : 'false',
    availableOnPrint: artwork?.availableOnPrint ? 'true' : 'false',
    printSizes: artwork?.printSizes ? JSON.stringify(artwork.printSizes) : '[]',
  });

  const [keepExistingImages, setKeepExistingImages] = useState(true);

  useEffect(() => {
    console.log('ArtworkForm received artwork:', artwork);
  }, [artwork]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const data = new FormData();

  // Append artwork fields
  Object.entries(formData).forEach(([key, value]) => {
    if (key === 'price' && value === '') {
      return; // Skip empty price
    }
    if (key === 'tags' && value) {
      data.append(key, value.split(',').map(tag => tag.trim()).join(',')); // Ensure clean tags
    } else {
      data.append(key, value);
    }
  });

  // Append keepExistingImages for edit mode
  if (mode === 'edit') {
    data.append('keepExistingImages', 'true'); // Default to true for POST
  }

  // Append new images
  const imageInput = document.querySelector<HTMLInputElement>('#images');
  if (imageInput?.files) {
    Array.from(imageInput.files).forEach(file => {
      data.append('images', file);
    });
  }

  // Log FormData entries
  console.log('FormData entries:', Array.from(data.entries()));
  onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === 'edit' ? 'Edit Artwork' : 'Create New Artwork'}
            </h2>
            <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              >
                <option value="">Select Category</option>
                <option value="portraits">Portraits</option>
                <option value="landscapes">Landscapes</option>
                <option value="still-life">Still Life</option>
                <option value="sketches">Sketches</option>
              </select>
            </div>

            <div>
              <label htmlFor="medium" className="block text-sm font-medium text-gray-700">
                Medium
              </label>
              <input
                type="text"
                id="medium"
                name="medium"
                value={formData.medium}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700">
                Dimensions
              </label>
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear()}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (£)
              </label>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price in pounds (leave blank if not set)"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
            </div>

            {mode === 'edit' && (
              <div>
                <label htmlFor="keepExistingImages" className="block text-sm font-medium text-gray-700">
                  Keep Existing Images
                </label>
                <select
                  id="keepExistingImages"
                  name="keepExistingImages"
                  value={keepExistingImages.toString()}
                  onChange={(e) => setKeepExistingImages(e.target.value === 'true')}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                {mode === 'edit' ? 'Add New Images' : 'Images'}
              </label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                accept="image/*"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="featured" className="block text-sm font-medium text-gray-700">
                Featured
              </label>
              <select
                id="featured"
                name="featured"
                value={formData.featured}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label htmlFor="sold" className="block text-sm font-medium text-gray-700">
                Sold
              </label>
              <select
                id="sold"
                name="sold"
                value={formData.sold}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label htmlFor="availableOnPrint" className="block text-sm font-medium text-gray-700">
                Available on Print
              </label>
              <select
                id="availableOnPrint"
                name="availableOnPrint"
                value={formData.availableOnPrint}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            <div>
              <label htmlFor="printSizes" className="block text-sm font-medium text-gray-700">
                Print Sizes (JSON format)
              </label>
              <textarea
                id="printSizes"
                name="printSizes"
                value={formData.printSizes}
                onChange={handleChange}
                rows={4}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {mode === 'edit' ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  mode === 'edit' ? 'Update Artwork' : 'Create Artwork'
                )}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};