// src/composables/useFieldError.ts
import { ref } from "vue"
import type { Ref } from "vue"

/**
 * useFieldError
 *
 * A small helper to manage field-level errors when:
 * - Backend returns a single error message
 * - That error belongs to one specific form field
 *
 * This composable merges:
 * - Client-side validation errors (e.g. vee-validate)
 * - Backend error (single message)
 *
 * Rules:
 * - Backend error has higher priority than client error
 * - Backend error is shown only on the targeted field
 * - Backend error should be cleared when the user edits that field

 * @example
 * ```ts
 * import { useForm } from "vee-validate"
 * import { toTypedSchema } from "@vee-validate/zod"
 * import { useFieldError } from "@/composables/useFieldError"
 *
 * const { values, errors, handleSubmit } = useForm<RegisterFormValues>({
 *   validationSchema: toTypedSchema(registerZodSchema),
 * })
 *
 * const {
 *   fieldError,
 *   setBackendError,
 *   clearBackendError,
 * } = useFieldError<RegisterFormValues>(errors)
 *
 * // Handle backend error
 * setBackendError("email", "Email already exists")
 *
 * // Template usage
 * // <BaseFormField :error="fieldError('email')">
 * //   <input v-model="values.email" @input="clearBackendError('email')" />
 * // </BaseFormField>
 * ```
 */
export const useFieldError = <T extends Record<string, unknown>>(
  /**
   * Reactive client-side validation errors.
   * Example: vee-validate `errors` object.
   */
  clientErrors: Ref<Partial<Record<keyof T, string>>>,
) => {
  /**
   * Backend error message.
   * Example: "Email already exists"
   */
  const serverError = ref<string | null>(null)

  /**
   * The form field that the backend error belongs to.
   * Example: "email"
   */
  const errorTargetField = ref<keyof T | null>(null)

  /**
   * Assign a backend error message to a specific field.
   *
   * @param field - Target form field
   * @param message - Backend error message
   */
  const setBackendError = (field: keyof T, message: string) => {
    serverError.value = message
    errorTargetField.value = field
  }

  /**
   * Clear backend error when the user edits the related field.
   * Should be called from input events (e.g. @input).
   *
   * @param field - Field being edited
   */
  const clearBackendError = (field: keyof T) => {
    if (errorTargetField.value === field) {
      serverError.value = null
      errorTargetField.value = null
    }
  }

  /**
   * Get the error message for a specific field.
   *
   * Priority:
   * 1. Backend error (if this field is the target)
   * 2. Client-side validation error
   *
   * @param field - Form field name
   * @returns Error message or undefined
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
