import ChatComponent from "@/components/ChatComponent";
import ChatSideBar from "@/components/ChatSideBar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import { DotPattern } from "@/components/magicui/dot-pattern";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  const isPro = await checkSubscription();

  return (
    // <div className="flex max-h-full overflow-hidden">
    //   <div className="flex w-full max-h-screen overflow-scroll">
    //     {/* chat sidebar */}
    //     <div className="flex-[1] max-w-xs">
    //       <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
    //     </div>
    //     {/* pdf viewer */}
    //     <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
    //       <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
    //     </div>
    //     {/* chat component */}
    //     <div className="flex-[3] border-l-4 border-l-slate-200">
    //       <ChatComponent chatId={parseInt(chatId)} />
    //     </div>
    //   </div>
    // </div>
<div className=" backdrop-blur-md rounded-lg bg-black-900/50 border [backdrop-filter:blur(8px)]">
  <DotPattern className="absolute inset-0 opacity-10" />
  <div className="flex h-screen overflow-hidden bg-gray-950">
    <div className="flex w-full h-full overflow-hidden">
      {/* Chat Sidebar */}
      <div className="flex-[1] max-w-xs h-screen overflow-auto">
        <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
      </div>
      {/* PDF Viewer */}
      <div className="flex-auto h-screen overflow-hidden">
        <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
      </div>
      {/* Chat Component */}
      <div className="fixed bottom-4 right-4 z-20 w-[350px] rounded-2xl ring-[2px] ring-[#1d1d1d] backdrop-blur-md transition-shadow [pointer-events:all] focus-within:ring-neutral-700 bg-gray-900 border border-indigo-300/20 shadow-lg shadow-indigo-500/20 [backdrop-filter:blur(8px)]">
        <ChatComponent chatId={parseInt(chatId)} />
      </div>
    </div>
  </div>
</div>





  );
};

export default ChatPage;