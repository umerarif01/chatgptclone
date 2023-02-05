import Image from "next/image";
import React, { useState } from "react";
import Loader from "./Loader";

const ImageLog = ({ imgUrl, loading }) => {
  return (
    <>
      {loading ? (
        <div className={`chat-message chatgpt`}>
          <div className="chat-message-center">
            <Image
              src="/aicon.jpg"
              width={40}
              height={40}
              alt="Image was unable to be generated"
              className={`avatar chatgpt`}
            />
            <div className="message">
              {imgUrl == "" ? (
                "Create Image with stable diffusion"
              ) : (
                <Image src={imgUrl} alt="output" width={640} height={640} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default ImageLog;
