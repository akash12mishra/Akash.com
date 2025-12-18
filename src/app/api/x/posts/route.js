import { NextResponse } from "next/server";

export const revalidate = 300;

const X_API_BASE = "https://api.x.com/2";

function clampNumber(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function getXPostUrl(username, id) {
  return `https://x.com/${username}/status/${id}`;
}

export async function GET(req) {
  void req;
  return NextResponse.json(
    {
      ok: false,
      error:
        "X API feed has been disabled. This project uses official X embeds instead.",
      user: null,
      posts: [],
    },
    { status: 410 }
  );
}
