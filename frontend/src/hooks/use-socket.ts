"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
type UseSocketResult = {
  socket: Socket | null;
  connected: boolean;
};

export function useSocket(): UseSocketResult {
  const { userId, isLoaded } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      setConnected(false);
      setSocket((prev) => {
        if (prev) {
          prev.disconnect();
        }
        return null;
      });
      return;
    }
    const baseUrl = "http://localhost:5000";
    const socketInstance: Socket = io(baseUrl, {
      auth: { userId },
      withCredentials: true,
      transports: ["websocket"],
    });
    setSocket(socketInstance);
    const handleConnect = () => {
      console.log(
        `socket connected with socketInstance id ..${socketInstance.id}`
      );
      setConnected(true);
    };
    const handleDisconnect = (reason: any) => {
      console.log(
        "socket disconnected with id ",
        socketInstance.id,
        " ",
        reason
      );
      setConnected(false);
    };
    const handleConnectError = (err: any) => {
      console.error(err);
    };
    socketInstance.on("connect", handleConnect);
    socketInstance.on("disconnect", handleDisconnect);
    socketInstance.on("connect_error", handleConnectError);
    return () => {
      socketInstance.off("connect", handleConnect);
      socketInstance.off("disconnect", handleDisconnect);
      socketInstance.off("connect_error", handleConnectError);
      socketInstance.disconnect();
      setConnected(false);
      setSocket(null);
    };
  }, [userId, isLoaded]);

  return { socket, connected };
}
