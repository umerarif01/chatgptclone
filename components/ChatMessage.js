import Image from "next/image";
import React from "react";

const ChatMessage = ({ message }) => {
  return (
    <div>
      <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
        <div className="chat-message-center">
          <Image
            src={`${message.user === "gpt" ? "/aicon.jpg" : "/user.png"}`}
            width={40}
            height={40}
            alt={`${message.user === "gpt" ? "gpt" : "user"}`}
            className={`avatar ${message.user === "gpt" && "chatgpt"}`}
          />
          <div className="message">{message.message}</div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
