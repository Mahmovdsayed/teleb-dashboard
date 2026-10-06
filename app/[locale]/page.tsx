import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export const instant = false

export default async function Page() {
  const t = await getTranslations('dashboard');

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium text-4xl tracking-tighter">{t("title")}</h1>
          <p className="text-2xl tracking-tighter">{t("description")}</p>
          <div className="flex items-center mt-2 gap-2">
            <Button size={"lg"}>{t("button")}</Button>
            <Suspense fallback={<div>Loading...</div>}>
              <LocaleSwitcher />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
