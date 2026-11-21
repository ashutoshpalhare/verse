export type Photo = {
  id: string;
  /** Previous filename-derived IDs used to migrate saved favorites and metadata. */
  legacyIds?: string[];
  imageUrl: string;
  title: string;
  description: string;
  date: string;
  isFavorite: boolean;
  createdAt: string;
};
