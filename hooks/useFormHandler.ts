"use client"

import { useEffect, useState } from "react"
import { useForm, FieldValues, DefaultValues, SubmitHandler, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale } from "next-intl"
import { ZodTypeAny } from "zod"
import { localizedZodError, type Lang } from "@/lib/getValidationErrorMap"
import { apiRequest } from "@/lib/api-request"

interface UseFormHandlerOptions<T extends FieldValues> {
  schema: ZodTypeAny
  endpoint?: string
  method?: "post" | "patch" | "put" | "delete"
  service?: (data: T, ...args: any[]) => Promise<any>
  defaultValues?: DefaultValues<T>
  values?: T
  onMutate?: (data: T) => any | Promise<any>
  onSuccess?: (data: any, context?: any) => void
  onError?: (error: any, context?: any) => void
}

export function useFormHandler<T extends FieldValues>({
  schema,
  endpoint,
  method = "post",
  service,
  defaultValues,
  values,
  onMutate,
  onSuccess,
  onError,
}: UseFormHandlerOptions<T>) {
  const [loading, setLoading] = useState(false)
  const locale = useLocale() as Lang

  const form = useForm<T>({
    resolver: zodResolver(schema as any, {
      error: localizedZodError(locale) as any,
    }),
    defaultValues,
    values,
    mode: "onChange",
    reValidateMode: "onChange",
  })

  useEffect(() => {
    if (form.formState.isSubmitted) {
      form.trigger()
    }
  }, [locale])

  const submitHandler: SubmitHandler<T> = async (data) => {
    let context: any
    try {
      setLoading(true)

      if (onMutate) {
        context = await onMutate(data)
      }

      let responseData: any

      if (service) {
        responseData = await service(data)
      } else {
        if (!endpoint) throw new Error("No endpoint or service provided")

        responseData = await apiRequest(endpoint, {
          method: method.toUpperCase() as "POST" | "PATCH" | "PUT" | "DELETE",
          body: data,
          locale,
        })
      }

      const isBetterAuthResult = responseData && typeof responseData === "object" && "error" in responseData
      const hasError = isBetterAuthResult ? Boolean(responseData.error) : responseData?.success === false

      if (hasError) {
        const error = isBetterAuthResult ? responseData.error : responseData?.message || responseData
        onError?.(error, context)
      } else {
        onSuccess?.(responseData, context)
        form.reset()
      }
    } catch (error: any) {
      onError?.(error, context)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = form.handleSubmit(submitHandler)

  return {
    ...form,
    onSubmit,
    loading,
  } as UseFormReturn<T> & {
    onSubmit: (e?: unknown) => Promise<void>
    loading: boolean
  }
}
