  export interface Artwork {
  images: any;
  id: number;
  title: string;
  medium: string;
  dimensions: string;
  description: string;
}

export type SocialButtonProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href?: string;
};

export type ContactItemProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
  href?: string;
  delay?: number;
};

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
}

export interface RegisterUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
}


export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  // Add your profile fields here
  [key: string]: User;
}

export interface UserProfile {
  // Add your user profile fields here
  [key: string]: User;
}

export interface Artwork {
  id: number;
  title: string;
  medium: string;
  dimensions: string;
  description: string;
  category: string;
  year: string;
}

export interface ArtworkCardProps {
  artwork: Artwork;
  isVisible?: boolean;
  delay?: number;
  onViewClick?: (artwork: Artwork) => void;
  showCategory?: boolean;
  showYear?: boolean;
  showDimensions?: boolean;
  showDescription?: boolean;
  showViewButton?: boolean;
  className?: string;
}

export interface ArtworkGalleryProps {
  artworks?: Artwork[];
  title?: string;
  subtitle?: string;
  description?: string;
  showHeader?: boolean;
  showCTA?: boolean;
  ctaText?: string;
  ctaLink?: string;
  onArtworkClick?: (artwork: Artwork) => void;
  columns?: 1 | 2 | 3 | 4;
  cardProps?: Partial<ArtworkCardProps>;
  className?: string;
  visibleElements?: Set<string>;
}