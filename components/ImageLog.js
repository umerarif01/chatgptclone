import Image from "next/image";
import React, { useState } from "react";
import Loader from "./Loader";

const ImageLog = ({ imgUrl, loading, model, images }) => {
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
                `Create Image with ${model}`
              ) : (
                <>
                  {model !== "All Models" ? (
                    <>
                      <img
                        src={imgUrl}
                        alt="output"
                        width={640}
                        height={640}
                        className="ai-image"
                      />
                    </>
                  ) : (
                    images.map((image, index) => (
                      <div key={index}>
                        <p className="imgname">{image.name}:</p>
                        <img
                          src={image.url}
                          alt="output"
                          width={640}
                          height={640}
                          className="ai-image"
                        />
                      </div>
                    ))
                  )}
                </>
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
