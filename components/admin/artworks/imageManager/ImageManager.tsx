'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { useArtworkImages, useAddImagesToArtwork, useRemoveImageFromArtwork, useSetPrimaryImage } from '@/hooks/useArtwork';
import { Upload, X, Star } from 'lucide-react';
import { ArtworkResponse, ImageData as ArtworkImageData } from '@/types/artwork';

interface ArtworkImageManagerProps {
  artwork: ArtworkResponse;
  onClose: () => void;
}

export const ArtworkImageManager: React.FC<ArtworkImageManagerProps> = ({
  artwork,
  onClose,
}) => {
  const [newImages, setNewImages] = useState<File[]>([]);
  const { data: imagesData, isLoading, error } = useArtworkImages(artwork.id);
  
  // Type the imagesData properly
  const typedImagesData = imagesData as {
    images?: ArtworkImageData[];
    primaryImage?: ArtworkImageData;
  } | undefined;
  const { mutate: addImages, isPending: isAddingImages } = useAddImagesToArtwork();
  const { mutate: removeImage, isPending: isRemovingImage } = useRemoveImageFromArtwork();
  const { mutate: setPrimaryImage, isPending: isSettingPrimary } = useSetPrimaryImage();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddImages = () => {
    if (newImages.length > 0) {
      const formData = new FormData();
      newImages.forEach(image => formData.append('images', image));
      addImages({ artworkId: artwork.id, images: formData });
      setNewImages([]);
    }
  };

  const handleRemoveImage = (publicId: string) => {
    if (window.confirm('Are you sure you want to remove this image?')) {
      removeImage({ artworkId: artwork.id, publicId });
    }
  };

  const handleSetPrimary = (publicId: string) => {
    setPrimaryImage({ artworkId: artwork.id, publicId });
  };

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading images. Please try again.
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Manage Images for {artwork.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-gray-700"
              >
                <Upload size={48} className="mb-2" />
                <p>Click to upload images</p>
                <p className="text-sm">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>

            {newImages.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {newImages.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(image)}
                      width={500}
                      height={500}
                      alt={`Upload ${index}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {newImages.length > 0 && (
              <button
                onClick={handleAddImages}
                disabled={isAddingImages}
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                {isAddingImages ? 'Uploading...' : 'Upload Images'}
              </button>
            )}
          </div>

          {/* Existing Images */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Existing Images</h3>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading images...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(() => {
                  const images = typedImagesData?.images;
                  return images?.map((image: ArtworkImageData) => (
                    <div key={image._id} className="relative group">
                      <Image
                        src={image.url}
                        alt={image.alt || artwork.title}
                        width={200}
                        height={200}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      {image.publicId === typedImagesData?.primaryImage?.publicId && (
                        <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                          <Star size={12} />
                          Primary
                        </div>
                      )}
                      <div className="absolute inset-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleSetPrimary(image.publicId)}
                          disabled={isSettingPrimary || image.publicId === typedImagesData?.primaryImage?.publicId}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 disabled:opacity-50"
                        >
                          Set Primary
                        </button>
                        <button
                          onClick={() => handleRemoveImage(image.publicId)}
                          disabled={isRemovingImage}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};