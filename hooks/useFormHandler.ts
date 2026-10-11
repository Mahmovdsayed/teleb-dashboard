"use client"

import { useEffect, useState } from "react"
import { useForm, FieldValues, DefaultValues, SubmitHandler, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale } from "next-intl"
import { ZodTypeAny } from "zod"
import { localizedZodError, type Lang } from "@/lib/getValidationErrorMap"
import { apiRequest } from "@/lib/api-request"
import { toast } from "@/components/ui/toast"

interface UseFormHandlerOptions<T extends FieldValues> {
  schema: ZodTypeAny
  endpoint?: string
  method?: "post" | "patch" | "put" | "delete"
  service?: (data: T, ...args: any[]) => Promise<any>
  defaultValues?: DefaultValues<T>
  values?: T
  onMutate?: (data: T) => any | Promise<any>
  onSuccess?: (data: any, context?: any) => void | Promise<void>
  onError?: (error: any, context?: any) => void | Promise<void>
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
      context = await onMutate?.(data)
      let responseData: any

      if (service) {
        responseData = await service(data)
      } else {
        if (!endpoint) {
          throw new Error("No endpoint or service provided")
        }

        responseData = await apiRequest(endpoint, {
          method: method.toUpperCase() as "POST" | "PATCH" | "PUT" | "DELETE",
          body: data,
          locale,
        })
      }

      if (responseData?.success === false) {
        const message = responseData.message || "Request failed"

        toast.add({
          title: message,
          type: "error",
          timeout: 5000,
        })

        await onError?.(message, context)
        return
      }

      toast.add({
        title: responseData?.message || "Operation completed successfully",
        type: "success",
        timeout: 5000,
      })

      await onSuccess?.(responseData, context)

      form.reset()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong"

      toast.add({
        title: message,
        type: "error",
        timeout: 5000,
      })

      await onError?.(error, context)
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
