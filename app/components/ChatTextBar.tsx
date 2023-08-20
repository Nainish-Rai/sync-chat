import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocket } from "@/context/SocketProvider";
import React, { useState, useEffect } from "react";

type Props = {
  handleMsgSubmit: (text: string, user: string) => void;
  username: string;
};

function ChatTextBar({ handleMsgSubmit, username }: Props) {
  const [textMsg, setTextMsg] = useState("");

  return (
    <div className="pt-4 lg:pb-4 pb-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (textMsg != "") {
            handleMsgSubmit(textMsg, username);
            setTextMsg("");
          }
        }}
        className="flex space-x-1"
      >
        <Input
          value={textMsg}
          className="border shadow  rounded-full"
          onChange={(e) => {
            setTextMsg(e.target.value);
          }}
          id="username"
          placeholder="Username"
        />
        <Button
          className="bg-red-200 shadow text-black dark:text-red-50 rounded-full"
          type="submit"
        >
          Send
        </Button>
      </form>
    </div>
  );
}

export default ChatTextBar;
