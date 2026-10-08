import type { ReactNode } from "react"

interface Props {
    children: ReactNode
}

export default function LoginLayout({ children }: Props) {
    return (
        <main>
            {children}
        </main>
    )
}