import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type UploadTask,
  type UploadTaskSnapshot
} from 'firebase/storage';
import { storage } from '@/config/firebase';

// Types
interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  bytesTransferred?: number;
  totalBytes?: number;
}

interface UploadResult {
  url: string;
  path: string;
  name?: string;
  metadata?: {
    contentType: string;
    size: number;
    name: string;
  };
}

/**
 * Storage Service
 * Handles all Firebase Storage operations for images
 */
export class StorageService {
  private static readonly GALLERY_PATH = 'gallery';
  private static readonly TEMP_PATH = 'temp';
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  /**
   * Validate image file
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No se seleccionó ningún archivo' };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de archivo no válido. Solo se permiten imágenes (JPG, PNG, WebP, GIF)'
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `El archivo es demasiado grande. Tamaño máximo: ${this.MAX_FILE_SIZE / 1024 / 1024}MB`
      };
    }

    return { valid: true };
  }

  /**
   * Generate unique filename
   */
  private static generateFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${randomString}.${extension}`;
  }

  /**
   * Upload image to Firebase Storage
   * @param file File to upload
   * @param onProgress Callback for upload progress
   * @param folder Optional folder path (default: 'gallery')
   */
  static async uploadImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void,
    folder: string = this.GALLERY_PATH
  ): Promise<UploadResult> {
    // Validate file
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    try {
      const filename = this.generateFilename(file.name);
      const path = `${folder}/${filename}`;
      const fileRef = storageRef(storage!, path);

      // Create upload task
      const uploadTask: UploadTask = uploadBytesResumable(fileRef, file, {
        contentType: file.type
      });

      // Return promise that resolves when upload completes
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            // Calculate and report progress
            const progress: UploadProgress = {
              loaded: snapshot.bytesTransferred,
              total: snapshot.totalBytes,
              percentage: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes
            };

            if (onProgress) {
              onProgress(progress);
            }
          },
          (error) => {
            console.error('Upload error:', error);
            reject(new Error('Error al subir la imagen. Intente nuevamente.'));
          },
          async () => {
            try {
              // Get download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

              const result: UploadResult = {
                url: downloadURL,
                path: path,
                metadata: {
                  contentType: file.type,
                  size: file.size,
                  name: filename
                }
              };

              resolve(result);
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject(new Error('Error al obtener URL de descarga'));
            }
          }
        );
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Error al subir la imagen');
    }
  }

  /**
   * Upload image to temp folder
   * Useful for preview before final save
   */
  static async uploadTempImage(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    return this.uploadImage(file, onProgress, this.TEMP_PATH);
  }

  /**
   * Delete image from Firebase Storage
   * @param pathOrUrl Full storage path or download URL
   */
  static async deleteImage(pathOrUrl: string): Promise<void> {
    try {
      let path = pathOrUrl;

      // If it's a URL, extract the path
      if (pathOrUrl.includes('firebasestorage.googleapis.com')) {
        const url = new URL(pathOrUrl);
        const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
        if (pathMatch && pathMatch[1]) {
          path = decodeURIComponent(pathMatch[1]);
        }
      }

      const fileRef = storageRef(storage!, path);
      await deleteObject(fileRef);
    } catch (error: any) {
      // Ignore error if file doesn't exist
      if (error.code === 'storage/object-not-found') {
        console.warn('File not found, skipping deletion:', pathOrUrl);
        return;
      }

      console.error('Error deleting image:', error);
      throw new Error('Error al eliminar la imagen');
    }
  }

  /**
   * Get image metadata without downloading
   */
  static extractPathFromUrl(url: string): string | null {
    try {
      if (!url.includes('firebasestorage.googleapis.com')) {
        return null;
      }

      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/o\/(.+?)\?/);

      if (pathMatch && pathMatch[1]) {
        return decodeURIComponent(pathMatch[1]);
      }

      return null;
    } catch (error) {
      console.error('Error extracting path from URL:', error);
      return null;
    }
  }

  /**
   * Check if URL is from Firebase Storage
   */
  static isFirebaseStorageUrl(url: string): boolean {
    return url.includes('firebasestorage.googleapis.com');
  }

  /**
   * Move file from temp to permanent gallery folder
   */
  static async moveTempToGallery(tempUrl: string): Promise<string> {
    try {
      // For now, we'll just return the URL as-is
      // In a production environment, you might want to actually move the file
      // This requires downloading and re-uploading, which can be expensive
      return tempUrl;
    } catch (error) {
      console.error('Error moving temp file:', error);
      throw new Error('Error al mover archivo temporal');
    }
  }

  /**
   * Compress image before upload (client-side)
   * Returns a new compressed File object
   */
  static async compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });

              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Given a storage path (eg. 'gallery/12345.webp') or a full download URL,
   * return a usable download URL. If the input is already a download URL it is
   * returned as-is. If it's a storage path it will call getDownloadURL.
   */
  static async getFileUrl(pathOrUrl: string): Promise<string> {
    try {
      if (!pathOrUrl) return ''

      // If it's already a full URL from Firebase Storage or any http(s) URL
      if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || this.isFirebaseStorageUrl(pathOrUrl)) {
        return pathOrUrl
      }

      // Otherwise treat as a storage path and get a download URL
      const fileRef = storageRef(storage!, pathOrUrl)
      const downloadURL = await getDownloadURL(fileRef)
      return downloadURL
    } catch (error) {
      console.error('[StorageService] getFileUrl error:', error)
      // Return original value as a graceful fallback
      return pathOrUrl
    }
  }
}

export default StorageService;
