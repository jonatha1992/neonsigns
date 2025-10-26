import { computed } from 'vue'
import { resolveCategoryLabel, CATEGORY_SELECT_OPTIONS } from '@/utils/categories'

export function useCategoryLabel(category: string | undefined) {
  return computed(() => resolveCategoryLabel(category))
}

export function getCategoryLabel(category: string | undefined): string {
  return resolveCategoryLabel(category)
}

export function getAllCategoryOptions(): { value: string; label: string }[] {
  return CATEGORY_SELECT_OPTIONS
}

export default useCategoryLabel
