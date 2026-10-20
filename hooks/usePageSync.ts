"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export const usePageSync = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const queryPage = Math.max(1, Number(searchParams.get("page")) || 1)
  const [currentPage, setCurrentPageState] = useState(queryPage)

  useEffect(() => {
    setCurrentPageState(queryPage)
  }, [queryPage])

  const setCurrentPage = useCallback((page: number) => {
    setCurrentPageState(Math.max(1, page))
  }, [])

  useEffect(() => {
    if (currentPage === queryPage) return
    const params = new URLSearchParams(searchParams.toString())

    if (currentPage === 1) {
      params.delete("page")
    } else {
      params.set("page", String(currentPage))
    }

    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname

    window.history.replaceState(null, "", url)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage, queryPage, pathname, searchParams])

  return { currentPage, setCurrentPage }
}
