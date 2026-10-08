"use client";

import { useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";
import { LogIn } from "lucide-react";
import { useFormHandler } from "@/hooks/useFormHandler";
import { loginSchema } from "@/validations/login";
import FormField from "../FormField";
import SubmitButton from "../SubmitButton";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/constant/constant";
import { loginInitialValues } from "@/constant/initial-values";
import { useStore } from "@/store";

export default function LoginForm() {
    const { push } = useRouter()
    const t = useTranslations("LoginPage");
    const setUser = useStore((state) => state.setUser)

    const {
        register, onSubmit, loading, reset,
        formState: { errors, isDirty, isValid },
    } = useFormHandler({
        schema: loginSchema,
        defaultValues: loginInitialValues,
        endpoint: `${API_BASE_URL}/auth/login`,
        method: "post",
        onSuccess: (data) => {
            setUser(data.data.user)
            push("/")
            toast.add({ title: data.message, type: "success" })
        },
        onError: (error) => {
            reset()
            toast.add({ title: error.message, type: "error" })
        },
    });

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col max-w-lg w-full gap-4 px-4 mt-4"
        >
            <FormField
                type="email"
                name="email"
                register={register}
                label={t("fields.email.label")}
                placeholder={t("fields.email.placeholder")}
                description={t("fields.email.description")}
                autoComplete="email"
                error={errors.email}
            />

            <FormField
                type="password"
                name="password"
                register={register}
                label={t("fields.password.label")}
                placeholder={t("fields.password.placeholder")}
                description={t("fields.password.description")}
                autoComplete="current-password"
                error={errors.password}
            />

            <SubmitButton
                type="submit"
                disabled={loading || !isDirty || !isValid}
                size="lg"
            >
                {loading ? (
                    <>
                        <Spinner />
                        {t("submit.loading")}
                    </>
                ) : (
                    <>
                        <LogIn size={18} />
                        {t("submit.idle")}
                    </>
                )}
            </SubmitButton>
        </form>
    );
}