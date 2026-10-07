import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import LoginPage from "@/components/pages/login/LoginPage"

interface Props {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({
    params
}: Props): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: "metadata.login" })

    return {
        title: t("title"),
        description: t("description"),
        robots: {
            index: false,
            follow: false
        }
    }
}

const Page = () => {
    return <LoginPage />
}

export default Page