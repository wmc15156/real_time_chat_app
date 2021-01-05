import React from "react";
import UserPanel from "./UserPanel";
import Favorited from "./Favorited";
import ChatRoom from "./ChatRoom";
import DirectMessages from "./DirectMessages";

const SidePanel = () => {
  return (
    <div
      style={{
        backgroundColor: "#8e44ad",
        padding: "2rem",
        height: "100vh",
        color: "white",
        minWidth: "275px",
      }}
    >
      <UserPanel />
      <Favorited />
      <ChatRoom />
      <DirectMessages />
    </div>
  );
};

export default SidePanel;
