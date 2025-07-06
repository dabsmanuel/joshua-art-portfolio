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
    status: artwork?.featured ? 'featured' : artwork?.sold ? 'sold' : 'none',
    availableOnPrint: artwork?.availableOnPrint ? 'true' : 'false',
    printSizes: {
      small: { selected: false, price: '' },
      large: { selected: false, price: '' },
      extraLarge: { selected: false, price: '' },
    },
  });

  const [keepExistingImages, setKeepExistingImages] = useState(true);

  useEffect(() => {
    if (artwork?.printSizes) {
      const initialPrintSizes = {
        small: { selected: false, price: '' },
        large: { selected: false, price: '' },
        extraLarge: { selected: false, price: '' },
      };
      artwork.printSizes.forEach(({ size, price }) => {
        if (size === 'small') initialPrintSizes.small = { selected: true, price };
        if (size === 'large') initialPrintSizes.large = { selected: true, price };
        if (size === 'extra large') initialPrintSizes.extraLarge = { selected: true, price };
      });
      setFormData(prev => ({ ...prev, printSizes: initialPrintSizes }));
    }
  }, [artwork]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrintSizeChange = (size: 'small' | 'large' | 'extraLarge', field: 'selected' | 'price', value: boolean | string) => {
    setFormData(prev => ({
      ...prev,
      printSizes: {
        ...prev.printSizes,
        [size]: {
          ...prev.printSizes[size],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // Append artwork fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'price' && value === '') {
        return; // Skip empty price
      }
      if (key === 'tags' && typeof value === 'string' && value) {
        data.append(key, value.split(',').map(tag => tag.trim()).join(',')); // Ensure clean tags
      } else if (key === 'status') {
        data.append('featured', value === 'featured' ? 'true' : 'false');
        data.append('sold', value === 'sold' ? 'true' : 'false');
      } else if (key === 'printSizes') {
        if (formData.availableOnPrint === 'true') {
          const printSizesArray = Object.entries(value)
            .filter(([_, sizeData]: [string, any]) => sizeData.selected && sizeData.price)
            .map(([size, sizeData]: [string, any]) => ({
              size: size === 'extraLarge' ? 'extra large' : size,
              price: sizeData.price,
            }));
          data.append('printSizes', JSON.stringify(printSizesArray));
        } else {
          data.append('printSizes', JSON.stringify([]));
        }
      } else {
        data.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
      }
    });

    if (mode === 'edit') {
      data.append('keepExistingImages', keepExistingImages.toString());
    }

    const imageInput = document.querySelector<HTMLInputElement>('#images');
    if (imageInput?.files) {
      Array.from(imageInput.files).forEach(file => {
        data.append('images', file);
      });
    }

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
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray- introverted-transparent"
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
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              >
                <option value="none">None</option>
                <option value="featured">Featured</option>
                <option value="sold">Sold</option>
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

            {formData.availableOnPrint === 'true' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Print Sizes and Prices
                </label>
                <div className="mt-2 space-y-2">
                  {(['small', 'large', 'extraLarge'] as const).map(size => (
                    <div key={size} className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        id={`printSize-${size}`}
                        checked={formData.printSizes[size].selected}
                        onChange={(e) => handlePrintSizeChange(size, 'selected', e.target.checked)}
                        className="h-4 w-4 text-gray-800 focus:ring-gray-800 border-gray-300 rounded"
                      />
                      <label htmlFor={`printSize-${size}`} className="text-sm font-medium text-gray-700">
                        {size === 'extraLarge' ? 'Extra Large' : size.charAt(0).toUpperCase() + size.slice(1)}
                      </label>
                      <input
                        type="text"
                        placeholder="Price (£)"
                        value={formData.printSizes[size].price}
                        onChange={(e) => handlePrintSizeChange(size, 'price', e.target.value)}
                        disabled={!formData.printSizes[size].selected}
                        className="mt-1 w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent disabled:bg-gray- introverted"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

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