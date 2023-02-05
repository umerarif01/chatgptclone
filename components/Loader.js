import Image from "next/image";
import React from "react";

const Loader = () => {
  return (
    <div className="loading">
      <div className={`chat-message chatgpt`}>
        <div className="chat-message-center">
          <Image
            src="/aicon.jpg"
            width={40}
            height={40}
            alt="gpt"
            className={`avatar chatgpt`}
          />
          <div class="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );

  return <div className="loading"></div>;
};

export default Loader;
