import { Timestamp } from 'firebase/firestore';

/**
 * Category types for gallery items
 */
export type GalleryCategory = 'negocios' | 'personalizado' | 'hogar' | 'eventos' | 'decorativo';

/**
 * Main Gallery Item interface stored in Firestore
 */
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: GalleryCategory;
  price?: number;
  isFeatured: boolean;
  isActive: boolean;
  orderIndex: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Form data for creating/updating gallery items
 * Used in admin forms before converting to GalleryItem
 */
export interface GalleryItemFormData {
  title: string;
  description: string;
  imageUrl: string;
  category: GalleryCategory;
  price?: number;
  isFeatured: boolean;
  isActive: boolean;
}

/**
 * Create operation payload
 */
export interface CreateGalleryItemData extends GalleryItemFormData {
  orderIndex: number;
}

/**
 * Update operation payload
 */
export interface UpdateGalleryItemData extends Partial<GalleryItemFormData> {
  orderIndex?: number;
}

/**
 * Filter options for querying gallery items
 */
export interface GalleryFilters {
  category?: GalleryCategory;
  isFeatured?: boolean;
  isActive?: boolean;
  limit?: number;
}

/**
 * Sort options for ordering gallery items
 */
export interface GallerySortOptions {
  field: 'orderIndex' | 'createdAt' | 'updatedAt' | 'title';
  direction: 'asc' | 'desc';
}

/**
 * Response from Firestore queries with metadata
 */
export interface GalleryQueryResult {
  items: GalleryItem[];
  total: number;
  hasMore: boolean;
}

/**
 * File upload progress tracking
 */
export interface UploadProgress {
  percentage: number;
  bytesTransferred: number;
  totalBytes: number;
}

/**
 * File upload result
 */
export interface UploadResult {
  url: string;
  path: string;
  metadata: {
    contentType: string;
    size: number;
    name: string;
  };
}

/**
 * Error types for better error handling
 */
export enum GalleryErrorType {
  NOT_FOUND = 'NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Custom error class for gallery operations
 */
export class GalleryError extends Error {
  constructor(
    message: string,
    public type: GalleryErrorType,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'GalleryError';
  }
}

/**
 * Category display information
 */
export interface CategoryInfo {
  value: GalleryCategory;
  label: string;
  description: string;
}

/**
 * Admin statistics for dashboard
 */
export interface GalleryStats {
  totalItems: number;
  activeItems: number;
  featuredItems: number;
  itemsByCategory: Record<GalleryCategory, number>;
}
