import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { message, currentModel } = req.body;

  try {
    const response = await openai.createCompletion({
      model: `${currentModel}`,
      prompt: `${message}`,
      max_tokens: 1000,
      temperature: 0.5,
    });
    res.status(200).json({
      success: true,
      message: response.data.choices[0].text,
    });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }

    res.status(400).json({
      success: false,
      error: "Unable to generate",
    });
  }
}
