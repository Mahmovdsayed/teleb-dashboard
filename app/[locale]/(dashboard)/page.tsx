import HomePage from "@/components/pages/home/HomePage";
import { Suspense } from "react";

const page = () => {
  return <>
    <Suspense fallback={<div></div>}>
      <HomePage />
    </Suspense>
  </>;
};

export default page;