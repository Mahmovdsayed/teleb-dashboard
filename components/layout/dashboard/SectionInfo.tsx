'use client';

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface IProps {
    title: string;
    desc: string;
    href?: string;
    buttonTitle?: string;
}

const SectionInfo = ({ title, desc, href, buttonTitle }: IProps) => {
    const { push } = useRouter()
    return <>
        <div className="pb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
            <div>
                <h1 className="font-semibold">{title}</h1>
                <p className="text-muted-foreground text-xs lg:text-sm">{desc}</p>
            </div>
            {
                buttonTitle && href &&
                <div>
                    <Button className={"w-full lg:w-fit"} onClick={() => push(href)}><Plus /> {buttonTitle}</Button>
                </div>
            }
        </div>
    </>;
};

export default SectionInfo;