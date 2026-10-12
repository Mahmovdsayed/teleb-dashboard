'use client';

import SubmitButton from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/button";
import { SaveCheck } from "lucide-react";
import { useRouter } from "next/navigation";


interface IProps {
    title: string
    desc: string
    children: React.ReactNode
    loading: boolean
    href: string
    backButtonTitle: string
    buttonLoding: string
    buttonSubmit: string
    onSubmit: () => void
}

const AddUpdateLayout = ({ onSubmit, title, desc, children, loading, href, backButtonTitle, buttonLoding, buttonSubmit }: IProps) => {
    const { push } = useRouter();

    return <>
        <div>
            <h1 className="mt-4 text-sm font-semibold">{title}</h1>
            <p className="text-xs text-muted-foreground">
                {desc}
            </p>
            <div className="my-8 flex items-center justify-center">
                <form
                    onSubmit={onSubmit}
                    className="flex w-full max-w-lg flex-col items-center justify-center gap-4 px-4"
                >
                    {children}
                    <div className="mt-4 grid w-full grid-cols-2 gap-2">
                        <Button
                            type="button"
                            onClick={() => push(href)}
                            className="w-full"
                            variant="secondary"
                        >
                            {backButtonTitle}
                        </Button>

                        <SubmitButton type="submit" disabled={loading}>
                            <SaveCheck />
                            {loading
                                ? buttonLoding
                                : buttonSubmit
                            }
                        </SubmitButton>
                    </div>
                </form>
            </div>
        </div>
    </>;
};

export default AddUpdateLayout;