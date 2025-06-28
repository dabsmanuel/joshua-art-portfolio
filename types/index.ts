  export interface Artwork {
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