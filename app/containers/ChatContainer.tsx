import React, { useCallback, useEffect, useRef, useState } from "react";
import ChatTextBar from "../components/ChatTextBar";
import { useSocket } from "@/context/SocketProvider";
type Props = {
  yourusername: string;
};
type Message = {
  text: string;
  user: string;
};

function ChatContainer({ yourusername }: Props) {
  const socket = useSocket();
  const [msgArray, setMsgArray] = useState<Message[]>([]);
  useEffect(() => {
    socket.on("msg:send", (data: { text: string; user: string }) => {
      setMsgArray((prev) => [...prev, data]);
    });
    return () => {
      socket.off("msg:send");
    };
  }, [socket]);

  const handleMsgSubmit = useCallback(
    (text: string, user: string) => {
      socket.emit("msg:send", { text, user });
    },
    [socket]
  );
  const messageEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageEl) {
      messageEl.current!.addEventListener("DOMNodeInserted", (event: any) => {
        const { currentTarget: target } = event;
        target!.scroll({ top: target!.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  return (
    <div className="lg:border shadow-lg  lg:rounded-3xl  p-4 h-full  lg:m-2 py-0 m-0  flex flex-col ">
      <div
        ref={messageEl}
        className=" h-full flex flex-col py-4 overflow-scroll scrollbar-hide"
      >
        {msgArray.map((msg, index) => {
          if (msg.user === yourusername) {
            return (
              <div
                className="text-black self-end bg-red-200 rounded-2xl w-fit p-2 px-4 pl-6 lg:max-w-xl max-w-sm   my-2"
                key={index}
              >
                <h5 className="font-bold text-black/70 text-right text-xs">
                  you
                </h5>
                <p className="text-right"> {msg.text}</p>
              </div>
            );
          }
          return (
            <div
              className="rounded-2xl w-fit p-2 px-4 pr-6  bg-black/90 text-white lg:max-w-xl max-w-sm  text-left my-2"
              key={index}
            >
              <h5 className="font-bold text-left text-xs">{msg.user}</h5>
              <p className="text-left">{msg.text}</p>
            </div>
          );
        })}
      </div>
      <ChatTextBar username={yourusername} handleMsgSubmit={handleMsgSubmit} />
    </div>
  );
}

export default ChatContainer;
