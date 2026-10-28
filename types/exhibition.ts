export interface Exhibition {
  id: string;
  title: string;
  venue: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  type: 'solo' | 'group';
  website?: string | null;
  artworksCount: number;
  featured: boolean;
  openingReception?: {
    date?: string;
    time?: string;
  };
  image?: {
    url: string;
    publicId: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type ExhibitionStatus = 'upcoming' | 'current' | 'past';

// An exhibition is "current" from the start of its first day to the end of its last day
export const getExhibitionStatus = (exhibition: Pick<Exhibition, 'startDate' | 'endDate'>): ExhibitionStatus => {
  const now = Date.now();
  const start = new Date(exhibition.startDate).getTime();
  const end = new Date(exhibition.endDate).getTime() + 24 * 60 * 60 * 1000 - 1;
  if (now < start) return 'upcoming';
  if (now > end) return 'past';
  return 'current';
};
