export interface APODSummary {
  title: string;
  date: string;
  mediaType: 'image' | 'video';
  imageUrl: string | null;
  hdImageUrl: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  explanation: string;
  copyright: string | null;
}

export interface APODGalleryResponse {
  items: APODSummary[];
  total: number;
}
