import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import Chatlog from "components/Chatlog";
import ImageLog from "components/ImageLog";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const currentModel = "text-davinci-003";
  const [prompt, setPrompt] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(true);
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "How can I help you today?",
    },
  ]);

  function clearChat() {
    setChatLog([]);
  }

  function toggleMode() {
    setMode(!mode);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(false);
    let chatLogNew = [...chatLog, { user: "me", message: `${prompt}` }];
    setPrompt("");
    setChatLog(chatLogNew);

    const messages = chatLogNew.map((message) => message.message).join("\n");
    const response = await fetch("https://gptbackend-lut4.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: messages,
        currentModel,
      }),
    });
    const data = await response.json();
    setLoading(true);
    console.log(data);
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
  }

  async function handleImage(e) {
    e.preventDefault();
    setLoading(false);
    setImgUrl("");
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      console.log({ prediction });
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      if (prediction.output != null) {
        console.log("break");
        setImgUrl(prediction.output[prediction.output.length - 1]);
        setPrompt("");
        setLoading(true);
        setPrediction(prediction);
        return;
      }
    }
  }

  return (
    <>
      <Head>
        <title>AI ChatBot</title>
        <meta name="description" content="Generate AI Content with GPT-3" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="App">
        <aside className="sidemenu">
          <Image
            priority
            src="/borgfy.png"
            width={240}
            height={120}
            alt="gpt"
            className={`logo`}
          />
          {mode ? (
            <div className="sidemenu-button" onClick={clearChat}>
              <span className="">+</span>
              New Chat
            </div>
          ) : (
            <></>
          )}

          <div className="sidemenu-button" onClick={toggleMode}>
            <span className="">+</span>
            {!mode ? <>Generate Text </> : <>Generate Image</>}
          </div>
        </aside>
        <section className="chatbox">
          {mode ? (
            <Chatlog chatLog={chatLog} loading={loading} />
          ) : (
            <>
              <ImageLog imgUrl={imgUrl} loading={loading} />
            </>
          )}

          <div className="margin-above" />
          <div className="chat-input-holder">
            <form onSubmit={mode ? handleSubmit : handleImage}>
              <input
                onChange={(e) => setPrompt(e.target.value)}
                className="chat-input-text"
                placeholder="Type your prompt here"
              />
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
