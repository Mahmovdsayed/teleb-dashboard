'use client'

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "@/components/ui/toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

interface IProps {
    children: React.ReactNode
}

const Provider = ({ children }: IProps) => {
    const [queryClient] = useState(() => new QueryClient());
    return <>
        <QueryClientProvider client={queryClient}>
            <NextThemesProvider enableSystem={true} storageKey="teleb_theme" attribute="class">
                <Toaster timeout={5000} />
                <TooltipProvider>
                    {children}
                </TooltipProvider>
            </NextThemesProvider>
        </QueryClientProvider>
    </>;
};

export default Provider;