<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { storeToRefs } from "pinia"
import { useField, useForm } from "vee-validate"

import { translate } from "@/plugins/language"
import BaseFormField from "@/shared/components/BaseFormField.vue"
import { useBaseFieldError } from "@/shared/composables/useBaseFieldError"

import {
  type LoginFormValues,
  type TodoFormValues,
  loginZodSchema,
  todoZodSchema,
} from "../models/form.schema"
import { useExampleStore } from "../stores/example.store"

/**
 * Initialize Example Pinia Store.
 * Acts as the single source of truth for:
 * - user
 * - authentication state
 * - exampleTodo list
 */
const exampleStore = useExampleStore()

/**
 * Extract actions from the store.
 */
const { login, addTodo, toggleTodo, removeTodo } = exampleStore

/**
 * Convert reactive state & getters into refs.
 */
const { user, isAuthenticated, exampleTodos } = storeToRefs(exampleStore)

/**
 * Login form instance.
 * Uses Zod schema for validation.
 */
const { handleSubmit: handleLoginSubmit, errors: loginErrors } = useForm<LoginFormValues>({
  validationSchema: toTypedSchema(loginZodSchema),
})

/**
 * Login name field.
 */
const { value: loginName } = useField<string>("name")

/**
 * Field-level error handling (client + backend).
 */
const { fieldError: loginFieldError, clearBackendError: clearLoginBackendError } =
  useBaseFieldError<LoginFormValues>(loginErrors)

/**
 * Handle login form submission.
 *
 * @param values - Validated login form values
 */
const handleLogin = handleLoginSubmit((values) => {
  login(values.name)

  /**
   * Example backend error:
   * setBackendError("name", "User not found")
   */
})

/**
 * exampleTodo form instance.
 */
const {
  handleSubmit: handleTodoSubmit,
  errors: todoErrors,
  resetForm: resetTodoForm,
} = useForm<TodoFormValues>({
  validationSchema: toTypedSchema(todoZodSchema),
})

/**
 * exampleTodo title field.
 */
const { value: todoTitle } = useField<string>("title")

/**
 * Field-level error handling (client + backend).
 */
const { fieldError: todoFieldError, clearBackendError: clearTodoBackendError } =
  useBaseFieldError<TodoFormValues>(todoErrors)

/**
 * Handle add exampleTodo submission.
 *
 * @param values - Validated exampleTodo form values
 */
const handleAddTodo = handleTodoSubmit((values) => {
  addTodo(values.title)
  resetTodoForm()
})
</script>

<template>
  <section class="flex flex-col gap-3 text-slate-100">
    <h2 class="text-xl font-semibold">
      {{ translate("features.example.form.title") }}
    </h2>

    <!-- ==========================================================
     LOGIN FORM
    =========================================================== -->
    <div class="space-y-4 rounded-xl p-4 border border-neutral-700 shadow-lg">
      <h3 class="text-lg font-semibold">
        {{ translate("features.example.form.login_title") }}
      </h3>

      <form @submit.prevent="handleLogin" class="space-y-3">
        <BaseFormField
          :label="translate('features.example.form.input.name.label')"
          field-name="name"
          :required="true"
          :error="loginFieldError('name')"
        >
          <input
            id="name"
            v-model="loginName"
            type="text"
            class="block w-full rounded-full mt-2 bg-neutral-700 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600"
            @input="clearLoginBackendError('name')"
          />
        </BaseFormField>

        <button
          type="submit"
          class="w-full inline-flex items-center justify-center bg-neutral-900 rounded-full px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          {{ translate("features.example.form.button.login") }}
        </button>
      </form>

      <p class="text-sm text-slate-400">
        Current user:
        <span class="font-medium text-slate-100">
          {{ user.name }}
        </span>
        <span v-if="isAuthenticated" class="ml-1 text-green-400"> (logged in) </span>
        <span v-else class="ml-1 text-red-400"> (not logged in) </span>
      </p>
    </div>

    <div class="space-y-4 rounded-xl p-4 border border-neutral-700 shadow-lg">
      <h3 class="text-lg font-semibold">Add Todo</h3>

      <form @submit.prevent="handleAddTodo" class="space-y-3">
        <BaseFormField
          label="Todo Title"
          field-name="title"
          :required="true"
          :error="todoFieldError('title')"
        >
          <input
            id="title"
            v-model="todoTitle"
            type="text"
            class="block w-full rounded-full mt-2 bg-neutral-700 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600"
            @input="clearTodoBackendError('title')"
          />
        </BaseFormField>

        <button
          type="submit"
          class="w-full inline-flex items-center justify-center bg-neutral-900 rounded-full px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
        >
          Add Todo
        </button>
      </form>

      <ul class="space-y-2 text-sm">
        <li
          v-for="todo in exampleTodos"
          :key="todo.id"
          class="flex items-center justify-between rounded-full bg-neutral-700 px-3 py-2"
        >
          <span
            class="truncate"
            :class="{
              'line-through text-slate-500': todo.done,
              'text-slate-100': !todo.done,
            }"
          >
            {{ todo.title }}
          </span>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="text-xs font-medium text-blue-400 hover:text-blue-300"
              @click="toggleTodo(todo.id)"
            >
              toggle
            </button>
            <button
              type="button"
              class="text-xs font-medium text-red-400 hover:text-red-300"
              @click="removeTodo(todo.id)"
            >
              remove
            </button>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
