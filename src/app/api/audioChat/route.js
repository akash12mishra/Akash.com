import WebSocket from "ws";
import pako from "pako";
import { NextResponse } from "next/server";

let ws = null;

async function getWebSocket() {
  return new Promise((resolve, reject) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log("[WebSocket] Using existing connection.");
      return resolve(ws);
    }

    console.time("websocketConnection");
    const wsUrl = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01`;
    ws = new WebSocket(wsUrl, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Beta": "realtime=v1",
      },
    });

    ws.on("open", () => {
      console.timeEnd("websocketConnection");
      console.log("[WebSocket] Connection established.");
      resolve(ws);
    });

    ws.on("error", (error) => {
      console.error("[WebSocket] Error:", error);
      reject(error);
    });

    ws.on("close", () => {
      console.log("[WebSocket] Connection closed.");
      ws = null;
    });
  });
}

export async function POST(req) {
  console.time("apiProcessing");

  try {
    const { audioData, isCompressed, message } = await req.json();

    if (!audioData && !message) {
      return NextResponse.json(
        { error: "Missing audio or text input." },
        { status: 400 }
      );
    }

    const socket = await getWebSocket();

    let audioResponseChunks = [];
    let finalTextResponse = "";

    socket.on("message", (data) => {
      const parsedData = JSON.parse(data.toString());
      console.log("[WebSocket] Received message:", parsedData.type);

      if (parsedData.type === "error") {
        throw new Error(parsedData.error.message);
      }

      if (
        parsedData.type === "conversation.item.create" &&
        parsedData.item.role === "assistant"
      ) {
        const textContent = parsedData.item.content.find(
          (item) => item.type === "output_text"
        );
        if (textContent) {
          finalTextResponse += textContent.text;
        }
      }

      if (parsedData.type === "response.audio.delta") {
        const chunk = Buffer.from(parsedData.delta, "base64");
        audioResponseChunks.push(chunk);
      }
    });

    console.time("dataProcessing");
    let processedAudio = audioData;
    if (isCompressed) {
      const compressed = Uint8Array.from(atob(audioData), (c) =>
        c.charCodeAt(0)
      );
      const decompressed = pako.inflate(compressed);
      processedAudio = new TextDecoder().decode(decompressed);
      console.log("[Data Processing] Decompressed audio data.");
    }
    console.timeEnd("dataProcessing");

    const userEvent = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: processedAudio
          ? [{ type: "input_audio", audio: processedAudio }]
          : [{ type: "input_text", text: message }],
      },
    };

    socket.send(JSON.stringify(userEvent));
    socket.send(JSON.stringify({ type: "response.create" }));

    await new Promise((resolve) => {
      socket.on("message", (data) => {
        const parsedData = JSON.parse(data.toString());
        if (parsedData.type === "response.done") {
          resolve();
        }
      });
    });

    const finalAudioBuffer = Buffer.concat(audioResponseChunks);
    const audioBase64 = finalAudioBuffer.toString("base64");
    const audioMimeType = determineAudioMimeType(finalAudioBuffer);

    console.timeEnd("apiProcessing");

    return NextResponse.json({
      response: finalTextResponse,
      audioData: audioBase64,
      audioMimeType,
    });
  } catch (error) {
    console.error("[API Error]", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

function determineAudioMimeType(buffer) {
  const header = buffer.slice(0, 4).toString("hex");
  if (header.startsWith("fff3") || header.startsWith("fff2"))
    return "audio/mpeg";
  if (header.startsWith("5249")) return "audio/wav";
  if (header.startsWith("4f676753")) return "audio/ogg";
  if (header.startsWith("664c6143")) return "audio/flac";
  return "audio/mp3"; // Default to MP3 if unknown
}
