import { create } from "zustand"
import { persist } from "zustand/middleware"

import { createUserSlice, type UserSlice } from "./slices/user.slice"
export type Store = UserSlice

export const useStore = create<Store>()(
  persist(
    (...args) => ({
      ...createUserSlice(...args),
    }),
    {
      name: "teleb-store",
    }
  )
)
