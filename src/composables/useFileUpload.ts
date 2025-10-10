import { ref } from 'vue';
import StorageService from '@/services/storage.service';
import type { UploadProgress, UploadResult } from '@/types/gallery.types';

/**
 * Composable for file upload operations
 * Provides reactive state and methods for uploading files to Firebase Storage
 */
export function useFileUpload() {
  const uploading = ref(false);
  const progress = ref<UploadProgress>({
    percentage: 0,
    bytesTransferred: 0,
    totalBytes: 0
  });
  const error = ref<string | null>(null);
  const uploadedFile = ref<UploadResult | null>(null);

  /**
   * Upload file
   */
  const uploadFile = async (file: File, isTemp: boolean = false): Promise<UploadResult | null> => {
    uploading.value = true;
    error.value = null;
    uploadedFile.value = null;

    try {
      const result = isTemp
        ? await StorageService.uploadTempImage(file, (prog) => {
            progress.value = prog;
          })
        : await StorageService.uploadImage(file, (prog) => {
            progress.value = prog;
          });

      uploadedFile.value = result;
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al subir el archivo';
      console.error('Upload error:', err);
      return null;
    } finally {
      uploading.value = false;
    }
  };

  /**
   * Delete file
   */
  const deleteFile = async (pathOrUrl: string): Promise<boolean> => {
    error.value = null;

    try {
      await StorageService.deleteImage(pathOrUrl);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al eliminar el archivo';
      console.error('Delete error:', err);
      return false;
    }
  };

  /**
   * Validate file
   */
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    return StorageService.validateFile(file);
  };

  /**
   * Compress image
   */
  const compressImage = async (file: File, maxWidth?: number, quality?: number): Promise<File | null> => {
    error.value = null;

    try {
      return await StorageService.compressImage(file, maxWidth, quality);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al comprimir la imagen';
      console.error('Compression error:', err);
      return null;
    }
  };

  /**
   * Check if URL is from Firebase Storage
   */
  const isFirebaseUrl = (url: string): boolean => {
    return StorageService.isFirebaseStorageUrl(url);
  };

  /**
   * Extract path from Firebase Storage URL
   */
  const extractPath = (url: string): string | null => {
    return StorageService.extractPathFromUrl(url);
  };

  /**
   * Reset upload state
   */
  const reset = (): void => {
    uploading.value = false;
    progress.value = {
      percentage: 0,
      bytesTransferred: 0,
      totalBytes: 0
    };
    error.value = null;
    uploadedFile.value = null;
  };

  /**
   * Clear error
   */
  const clearError = (): void => {
    error.value = null;
  };

  return {
    // State
    uploading,
    progress,
    error,
    uploadedFile,

    // Methods
    uploadFile,
    deleteFile,
    validateFile,
    compressImage,
    isFirebaseUrl,
    extractPath,
    reset,
    clearError
  };
}

export default useFileUpload;
