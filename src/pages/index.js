import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { useState, useEffect } from "react";
import ChatMessage from "components/ChatMessage";
import Loader from "components/Loader";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("text-davinci-003");
  const [loading, setLoading] = useState(true);
  const [chatLog, setChatLog] = useState([
    {
      user: "gpt",
      message: "How can I help you today?",
    },
  ]);

  function clearChat() {
    setChatLog([]);
  }

  function fetchModels() {
    fetch("https://gptbackend-lut4.onrender.com/models")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.models);
        setModels(data.models);
      });
  }

  useEffect(() => {
    fetchModels();
  }, []);

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
          <div className="sidemenu-button" onClick={clearChat}>
            <span className="">+</span>
            New Chat
          </div>
          <div className="models">
            <label>Select Model:</label>
            <select onChange={(e) => setCurrentModel(e.target.value)}>
              {models.map((model, index) => (
                <option key={index} value={model.id}>
                  {model.id}
                </option>
              ))}
            </select>
          </div>
        </aside>
        <section className="chatbox">
          <div className="chat-log">
            {chatLog.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          </div>

          <div className="chat-input-holder">
            <form onSubmit={handleSubmit}>
              {!loading ? (
                <Loader />
              ) : (
                <input
                  onChange={(e) => setPrompt(e.target.value)}
                  className="chat-input-text"
                  placeholder="Type your message here"
                />
              )}
            </form>
          </div>
        </section>
      </main>
    </>
  );
}

// #41404e
