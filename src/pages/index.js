import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import Chatlog from "components/Chatlog";
import ImageLog from "components/ImageLog";
import axios from "axios";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const currentModel = "text-davinci-003";
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
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

  async function generateText(e) {
    e.preventDefault();
    setLoading(false);
    let chatLogNew = [...chatLog, { user: "me", message: `${prompt}` }];
    setPrompt("");
    setChatLog(chatLogNew);

    const messages = chatLogNew.map((message) => message.message).join("\n");
    const response = await fetch(process.env.NEXT_PUBLIC_GPT_URL, {
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

  const generateImage = async (e) => {
    e.preventDefault();
    setLoading(false);
    console.log("Generating Image");
    // You can replace this with different model API's
    const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`;

    // Send the request
    const response = await axios({
      url: URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        inputs: prompt,
        options: { wait_for_model: true },
      }),
      responseType: "arraybuffer",
    });

    const type = response.headers["content-type"];
    const data = response.data;
    const base64data = Buffer.from(data).toString("base64");
    const img = `data:${type};base64,` + base64data; // <-- This is so we can render it on the page
    setImage(img);
    setLoading(true);
  };

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
          {mode && (
            <div className="sidemenu-button" onClick={clearChat}>
              <span>+</span>
              New Chat
            </div>
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
              <ImageLog imgUrl={image} loading={loading} />
            </>
          )}

          <div className="margin-above" />
          <div className="chat-input-holder">
            <form
              onSubmit={mode ? generateText : generateImage}
              className="form"
            >
              <input
                onChange={(e) => setPrompt(e.target.value)}
                className="chat-input"
                placeholder="Type your prompt here"
              />
              <input type="submit" value="Send" className="input-button" />
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
