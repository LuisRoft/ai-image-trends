import {
  GoogleGenAI,
  GenerateContentResponse,
  Part,
  Modality,
} from "@google/genai";
import { NextResponse } from "next/server";

if (!process.env.API_KEY) {
  throw new Error("Missing API_KEY");
}

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const buffer = await file.arrayBuffer();
  let mimeType = file.type;

  // Map unsupported formats to supported ones
  const supportedFormats = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/bmp",
  ];

  if (!supportedFormats.includes(file.type)) {
    // For unsupported formats like AVIF, WebP, treat as JPEG
    mimeType = "image/jpeg";
    console.warn(`Unsupported image format ${file.type}, treating as JPEG`);
  }

  const base64EncodedData = Buffer.from(buffer).toString("base64");
  return {
    inlineData: { data: base64EncodedData, mimeType },
  };
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const prompt = formData.get("prompt") as string;
    const images = formData.getAll("images") as File[];

    const imageParts = await Promise.all(
      images.map((file) => fileToGenerativePart(file))
    );
    const textPart: Part = { text: prompt };

    const response: GenerateContentResponse =
      await genAI.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: [{ parts: [textPart, ...imageParts] }],
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
      });

    const result: Part[] = response.candidates?.[0]?.content?.parts || [];

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error generating image:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", details: errorMessage },
      { status: 500 }
    );
  }
}
