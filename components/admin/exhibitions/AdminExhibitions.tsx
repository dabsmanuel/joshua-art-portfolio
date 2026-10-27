'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, X, Loader2, ExternalLink } from 'lucide-react';
import {
  useExhibitions,
  useCreateExhibition,
  useUpdateExhibition,
  useDeleteExhibition,
} from '@/hooks/useExhibition';
import { Exhibition, getExhibitionStatus } from '@/types/exhibition';

// <input type="date"> wants yyyy-mm-dd
const toDateInput = (value?: string) => (value ? new Date(value).toISOString().slice(0, 10) : '');

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const fieldClass =
  'mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-800 focus:border-transparent';

interface ExhibitionFormProps {
  exhibition?: Exhibition;
  isLoading: boolean;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

const ExhibitionForm: React.FC<ExhibitionFormProps> = ({ exhibition, isLoading, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: exhibition?.title ?? '',
    venue: exhibition?.venue ?? '',
    location: exhibition?.location ?? '',
    startDate: toDateInput(exhibition?.startDate),
    endDate: toDateInput(exhibition?.endDate),
    type: exhibition?.type ?? 'solo',
    artworksCount: String(exhibition?.artworksCount ?? ''),
    website: exhibition?.website ?? '',
    description: exhibition?.description ?? '',
    openingDate: toDateInput(exhibition?.openingReception?.date),
    openingTime: exhibition?.openingReception?.time ?? '',
    featured: exhibition?.featured ?? false,
  });
  const [removeImage, setRemoveImage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', form.title);
    data.append('venue', form.venue);
    data.append('location', form.location);
    data.append('startDate', form.startDate);
    data.append('endDate', form.endDate);
    data.append('type', form.type);
    data.append('artworksCount', form.artworksCount || '0');
    data.append('website', form.website);
    data.append('description', form.description);
    data.append('featured', String(form.featured));
    data.append('openingDate', form.openingDate);
    data.append('openingTime', form.openingTime);
    if (removeImage) data.append('removeImage', 'true');

    const imageInput = document.querySelector<HTMLInputElement>('#exhibition-image');
    if (imageInput?.files?.[0]) {
      data.append('image', imageInput.files[0]);
    }
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-charcoal/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {exhibition ? 'Edit exhibition' : 'Add exhibition'}
            </h2>
            <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-700" aria-label="Close">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} required maxLength={150} className={fieldClass} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
                <input id="venue" name="venue" value={form.venue} onChange={handleChange} required className={fieldClass} />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input id="location" name="location" value={form.location} onChange={handleChange} required placeholder="City, country" className={fieldClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start date</label>
                <input id="startDate" type="date" name="startDate" value={form.startDate} onChange={handleChange} required className={fieldClass} />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End date</label>
                <input id="endDate" type="date" name="endDate" value={form.endDate} min={form.startDate} onChange={handleChange} required className={fieldClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select id="type" name="type" value={form.type} onChange={handleChange} className={fieldClass}>
                  <option value="solo">Solo exhibition</option>
                  <option value="group">Group exhibition</option>
                </select>
              </div>
              <div>
                <label htmlFor="artworksCount" className="block text-sm font-medium text-gray-700">Artworks shown</label>
                <input id="artworksCount" type="number" min="0" name="artworksCount" value={form.artworksCount} onChange={handleChange} className={fieldClass} />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" name="description" value={form.description} onChange={handleChange} required rows={4} maxLength={2000} className={fieldClass} />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">Exhibition page (optional)</label>
              <input id="website" type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://" className={fieldClass} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="openingDate" className="block text-sm font-medium text-gray-700">Opening reception date (optional)</label>
                <input id="openingDate" type="date" name="openingDate" value={form.openingDate} onChange={handleChange} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="openingTime" className="block text-sm font-medium text-gray-700">Opening reception time</label>
                <input id="openingTime" name="openingTime" value={form.openingTime} onChange={handleChange} placeholder="18:00 - 21:00" className={fieldClass} />
              </div>
            </div>

            <div>
              <label htmlFor="exhibition-image" className="block text-sm font-medium text-gray-700">
                {exhibition?.image ? 'Replace image' : 'Image'}
              </label>
              <input
                id="exhibition-image"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className={fieldClass}
              />
              {exhibition?.image && (
                <label className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} />
                  Remove the current image
                </label>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
              />
              Feature this exhibition
            </label>

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Saving...
                  </>
                ) : exhibition ? 'Save changes' : 'Add exhibition'}
              </button>
              <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const statusStyles = {
  upcoming: 'bg-gray-100 text-gray-700 border-gray-300',
  current: 'bg-gray-100 text-gray-700 border-gray-300',
  past: 'bg-gray-100 text-gray-600 border-gray-200',
} as const;

const AdminExhibitions: React.FC = () => {
  const { data: exhibitions = [], isLoading, error } = useExhibitions();
  const createMutation = useCreateExhibition();
  const updateMutation = useUpdateExhibition();
  const deleteMutation = useDeleteExhibition();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Exhibition | undefined>();

  const closeForm = () => {
    setShowForm(false);
    setEditing(undefined);
  };

  const handleSubmit = (data: FormData) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data }, { onSuccess: closeForm });
    } else {
      createMutation.mutate(data, { onSuccess: closeForm });
    }
  };

  const handleDelete = (exhibition: Exhibition) => {
    if (window.confirm(`Delete "${exhibition.title}"? This cannot be undone.`)) {
      deleteMutation.mutate(exhibition.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">Exhibitions listed here appear on the public Exhibitions page.</p>
        <button
          onClick={() => { setEditing(undefined); setShowForm(true); }}
          className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add exhibition
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
        </div>
      ) : error ? (
        <p className="text-dot">Could not load exhibitions. Refresh the page to try again.</p>
      ) : exhibitions.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-600">
          No exhibitions yet. Use Add exhibition to list your first one.
        </div>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {exhibitions.map((exhibition) => {
            const status = getExhibitionStatus(exhibition);
            return (
              <li key={exhibition.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col sm:flex-row">
                <div className="relative sm:w-44 h-40 sm:h-auto bg-gray-100 shrink-0">
                  {exhibition.image ? (
                    <Image src={exhibition.image.url} alt={exhibition.title} fill className="object-cover" sizes="176px" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">No image</div>
                  )}
                </div>
                <div className="p-4 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${statusStyles[status]}`}>
                      {status === 'current' ? 'On now' : status}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{exhibition.type}</span>
                    {exhibition.featured && <span className="text-xs text-gray-500">Featured</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{exhibition.title}</h3>
                  <p className="text-sm text-gray-600">{exhibition.venue}, {exhibition.location}</p>
                  <p className="text-sm text-gray-500">{formatDate(exhibition.startDate)} to {formatDate(exhibition.endDate)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => { setEditing(exhibition); setShowForm(true); }} className="text-gray-700 hover:text-gray-900 flex items-center gap-1 text-sm">
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(exhibition)}
                      disabled={deleteMutation.isPending}
                      className="text-dot hover:text-dot flex items-center gap-1 text-sm disabled:opacity-50"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                    {exhibition.website && (
                      <a href={exhibition.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 flex items-center gap-1 text-sm">
                        <ExternalLink size={14} /> Page
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {showForm && (
        <ExhibitionForm
          exhibition={editing}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}
    </div>
  );
};

export default AdminExhibitions;
