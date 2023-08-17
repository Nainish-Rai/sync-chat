"use client";
import ChatContainer from "@/app/containers/ChatContainer";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/context/SocketProvider";

import React, { useCallback, useEffect, useState } from "react";

type Props = {
  params: {
    roomid: string;
  };
};
type peer = RTCPeerConnection;

function Room({ params }: Props) {
  const socket = useSocket();

  const [activeUsers, setActiveUsers] = useState([
    localStorage.getItem("username"),
    "nainish",
    "kakashi",
  ]);
  console.log(activeUsers);
  const [remoteId, setRemoteId] = useState("");

  const [myStream, setMyStream] = useState<MediaStream>();

  const handleUserJoined = useCallback(
    ({ username, id }: { username: string; id: string }) => {
      console.log(username + " joined", id);
      setRemoteId(id);
      setActiveUsers([...activeUsers, username]);
    },
    [activeUsers]
  );
  console.log(activeUsers[0]);

  useEffect(() => {
    socket.on(
      "user:joined",
      ({ username, id }: { username: string; id: string }) => {
        console.log(username + " joined", id);
        setRemoteId(id);
        setActiveUsers([...activeUsers, username]);
      }
    );

    return () => {
      socket.off("user:joined", handleUserJoined);
    };
  }, [activeUsers, handleUserJoined, socket]);

  return (
    <main className="w-full h-screen lg:p-4 lg:py-12 py-0">
      <div className="w-full max-w-7xl  mx-auto h-full flex flex-col lg:flex-row">
        {/* sidebar */}
        <div className=" w-[24%] lg:block hidden ">
          <div className=" shadow-md  rounded-3xl m-2 p-4 border border-red-200">
            <h3 className="font-medium pl-2 text-xl">
              Chatroom :{" "}
              <span className=" text-3xl text-red-300">{params.roomid}</span>
            </h3>
          </div>
          <div className="bg-red-200 shadow-md text-black rounded-3xl  p-4 m-2">
            <h3 className=" font-light px-2 text-3xl">Active Users</h3>
            <div className="flex flex-col px-2 mx-auto gap-1 mt-2">
              {activeUsers.map((user, index) => (
                <div className="font-medium" key={index}>
                  {user}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* chat container */}
        <div className="w-full h-full">
          <ChatContainer yourusername={activeUsers[0]!} />
        </div>
      </div>
    </main>
  );
}

export default Room;
