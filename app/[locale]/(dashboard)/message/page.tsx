import MessagePage from "@/components/pages/message/MessagePage";
import MessageSkeleton from "@/components/skeletons/MessageSkeleton";
import { Suspense } from "react";

export const instant = false

const page = () => {
  return <>
    <Suspense fallback={<MessageSkeleton />}>
      <MessagePage />
    </Suspense>
  </>;
};

export default page;