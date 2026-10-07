'use client';

import LoginForm from "@/components/forms/login/LoginForm";
import { useTranslations } from "next-intl";

const LoginPage = () => {
    const t = useTranslations("LoginPage");

    return <>
        <main className="min-h-dvh flex flex-col items-center justify-center">
            <h1 className="text-xl font-semibold tracking-tighter">{t("title")}</h1>
            <p className="text-sm mt-1 text-muted-foreground font-medium tracking-tighter">{t("subtitle")}</p>
            <LoginForm />
        </main>
    </>;
};

export default LoginPage;