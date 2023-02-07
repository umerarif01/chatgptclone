import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import Chatlog from "components/Chatlog";
import ImageLog from "components/ImageLog";
import axios from "axios";
import {
  generateHuggingFace,
  generateDALLE,
  generateReplicate,
  generateAll,
} from "utils/api";

export default function Home() {
  const currentModel = "text-davinci-003";
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState(true);
  const [model, setModel] = useState("DALL E");
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

  function chooseModel(model) {
    setModel(model);
  }

  async function generateText(e) {
    e.preventDefault();

    if (!prompt) {
      alert("Please type something in the input field");
      return;
    }
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

  async function generateImage(e) {
    e.preventDefault();

    if (!prompt) {
      alert("Please type something in the input field");
      return;
    }

    setImage("");
    setLoading(false);
    let img;

    switch (model) {
      case "DALL E":
        img = await generateDALLE(prompt);
        break;
      case "Hugging Face":
        img = await generateHuggingFace(prompt);
        break;
      case "Replicate":
        img = await generateReplicate(prompt);
        break;
      default:
        img = await generateAll(prompt);
        setImages(img);
        break;
    }

    setImage(img);
    setLoading(true);
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
          {mode && (
            <div className="sidemenu-button" onClick={clearChat}>
              <span>+</span>
              New Chat
            </div>
          )}

          {!mode ? (
            <>
              <div className="sidemenu-button" onClick={toggleMode}>
                <span className="">+</span>
                Generate Text
              </div>
              <p class="generate">Generate Image with:</p>
              <div
                className="sidemenu-button"
                onClick={() => chooseModel("DALL E")}
              >
                <span className="">+</span>
                DALL E
              </div>
              <div
                className="sidemenu-button"
                onClick={() => chooseModel("Hugging Face")}
              >
                <span className="">+</span>
                Hugging Face SD v2.1
              </div>
              <div
                className="sidemenu-button"
                onClick={() => chooseModel("Replicate")}
              >
                <span className="">+</span>
                Replicate SD v1
              </div>
              <div
                className="sidemenu-button"
                onClick={() => chooseModel("All Models")}
              >
                <span className="">+</span>
                All Models
              </div>
              <p class="generate">Model Selected:{model}</p>
            </>
          ) : (
            <>
              <div className="sidemenu-button" onClick={toggleMode}>
                <span className="">+</span>
                Generate Image
              </div>
            </>
          )}
        </aside>
        <section className="chatbox">
          {mode ? (
            <Chatlog chatLog={chatLog} loading={loading} />
          ) : (
            <>
              <ImageLog
                imgUrl={image}
                loading={loading}
                model={model}
                images={images}
              />
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
