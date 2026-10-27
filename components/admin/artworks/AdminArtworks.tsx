'use client'

import React, { useState } from 'react';
import { ArtworkList } from '@/components/admin/artworks/list/AdminList';
import { ArtworkDetailModal } from '@/components/admin/artworks/modal/ArtModal';
import { ArtworkImageManager } from '@/components/admin/artworks/imageManager/ImageManager';
import { ArtworkResponse } from '@/types/artwork';

export default function AdminArtworks() {
  const [viewingArtwork, setViewingArtwork] = useState<ArtworkResponse | null>(null);
  const [managingImagesArtwork, setManagingImagesArtwork] = useState<ArtworkResponse | null>(null);

  return (
    <>
      <ArtworkList />
      {viewingArtwork && (
        <ArtworkDetailModal
          artwork={viewingArtwork}
          onClose={() => setViewingArtwork(null)}
          onEdit={() => {
            setViewingArtwork(null);
            // The edit functionality is already handled in ArtworkList
          }}
          onManageImages={(artwork) => {
            setViewingArtwork(null);
            setManagingImagesArtwork(artwork);
          }}
        />
      )}
      {managingImagesArtwork && (
        <ArtworkImageManager
          artwork={managingImagesArtwork}
          onClose={() => setManagingImagesArtwork(null)}
        />
      )}
    </>
  );
}