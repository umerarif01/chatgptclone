const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function generateImage(prompt) {
  const response = await fetch("/api/dallE", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
    }),
  });
  const data = await response.json();
  const img = data.data;
  return img;
}

async function generateHuggingFace(prompt) {
  const URL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1`;

  const response = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      options: {
        use_cache: false,
        wait_for_model: true,
      },
    }),
  });

  const type = response.headers.get("content-type");
  const data = await response.arrayBuffer();

  const base64data = Buffer.from(data).toString("base64");
  const img = `data:${type};base64,` + base64data;
  return img;
}

async function generateReplicate(prompt) {
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
    console.log(prediction.detail);
    return;
  }

  while (prediction.status !== "succeeded" && prediction.status !== "failed") {
    await sleep(1000);
    const response = await fetch("/api/predictions/" + prediction.id);
    prediction = await response.json();
    console.log({ prediction });
    if (response.status !== 200) {
      console.log(prediction.detail);
      return;
    }
    if (prediction.output != null) {
      console.log("break");
      const img = prediction.output[prediction.output.length - 1];
      return img;
    }
  }
}

async function generateAll(prompt) {
  const [url1, url2, url3] = await Promise.all([
    generateImage(prompt),
    generateHuggingFace(prompt),
    generateHuggingFace(prompt),
  ]);
  return [
    { url: url1, name: "Dall E" },
    { url: url2, name: "Hugging Face Stable Diffusion v2.1" },
    { url: url3, name: "Replicate Stable Diffusion v1" },
  ];
}

export { generateHuggingFace, generateImage, generateReplicate, generateAll };
