import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

type ResourceKey = "products" | "collections" | "banners" | "offers" | "messages"
type ResourcePageMode = "list" | "create" | "edit"

export async function getResourceMetadata(
  resourceKey: ResourceKey,
  mode: ResourcePageMode,
): Promise<Metadata> {
  const [common, resource, dashboardMetadata] = await Promise.all([
    getTranslations("dashboard.resources"),
    getTranslations(`dashboard.resources.${resourceKey}`),
    getTranslations("dashboard.metadata"),
  ])

  const title =
    mode === "list"
      ? resource("title")
      : common(mode === "create" ? "createTitle" : "editTitle", {
          resource: resource("singular"),
        })
  const description =
    mode === "list" ? resource("listDescription") : resource("formDescription")

  return {
    title: `${title} | ${dashboardMetadata("siteName")}`,
    description,
  }
}
