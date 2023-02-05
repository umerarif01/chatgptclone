import React from "react";
import ChatMessage from "components/ChatMessage";
import Loader from "components/Loader";

const Chatlog = ({ chatLog, loading }) => {
  return (
    <div>
      <div className="chat-log">
        {chatLog.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {!loading ? <Loader /> : <></>}
      </div>
    </div>
  );
};

export default Chatlog;
