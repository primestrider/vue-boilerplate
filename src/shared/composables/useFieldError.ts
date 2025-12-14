// src/composables/useFieldError.ts
import { ref } from "vue"
import type { Ref } from "vue"

/**
 * Handle field-level errors where:
 * - Backend returns a single error message
 * - Error belongs to exactly one field
 *
 * Backend error always takes priority over client validation error.
 */
export const useFieldError = <T extends Record<string, unknown>>(
  clientErrors: Ref<Partial<Record<keyof T, string>>>,
) => {
  /**
   * Backend error message
   */
  const serverError = ref<string | null>(null)

  /**
   * Which field the backend error belongs to
   */
  const errorTargetField = ref<keyof T | null>(null)

  /**
   * Set backend error and assign it to a specific field
   */
  const setBackendError = (field: keyof T, message: string) => {
    serverError.value = message
    errorTargetField.value = field
  }

  /**
   * Clear backend error when user edits the related field
   */
  const clearBackendError = (field: keyof T) => {
    if (errorTargetField.value === field) {
      serverError.value = null
      errorTargetField.value = null
    }
  }

  /**
   * Get merged error for a field.
   *
   * Priority:
   * 1. Backend error (if targeting this field)
   * 2. Client-side validation error
   */
  const fieldError = <K extends keyof T>(field: K) =>
    errorTargetField.value === field
      ? (serverError.value ?? clientErrors.value[field])
      : clientErrors.value[field]

  return {
    serverError,
    errorTargetField,
    setBackendError,
    clearBackendError,
    fieldError,
  }
}
