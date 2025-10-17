import { NextResponse } from "next/server";
import { APP_URL } from "../../../lib/constants";

export async function GET() {
  const farcasterConfig = {
    "frame": {
      "name": "Base Stack",
      "version": "1",
      "iconUrl": "https://farcaster-base-cardgame-gilt.vercel.app/splash.png",
      "homeUrl": "https://farcaster-base-cardgame-gilt.vercel.app",
      "imageUrl": "https://farcaster-base-cardgame-gilt.vercel.app/splash.png",
      "splashImageUrl": "https://farcaster-base-cardgame-gilt.vercel.app/splash.png",
      "splashBackgroundColor": "#ffffff",
      "webhookUrl": "https://farcaster-base-cardgame-gilt.vercel.app/api/webhook",
      "subtitle": "Match 3 same cards",
      "description": "Match 3 same cards to clear them all",
      "primaryCategory": "games",
      "screenshotUrls": [
        "https://farcaster-base-cardgame-gilt.vercel.app/splash.png"
      ],
      "heroImageUrl": "https://farcaster-base-cardgame-gilt.vercel.app/splash.png"
    },
    "accountAssociation": {
      "header": "eyJmaWQiOjExMjAzODgsInR5cGUiOiJhdXRoIiwia2V5IjoiMHg1NDMwYWNGMENEMEI5RTNiMmFCMkQ5NDJBZjM0MzJCQTJmYzJFNGY3In0",
      "payload": "eyJkb21haW4iOiJmYXJjYXN0ZXItYmFzZS1jYXJkZ2FtZS1naWx0LnZlcmNlbC5hcHAifQ",
      "signature": "cztCZBgTueQ16ovThPp46uwEuRaUFsCwq1TpPcu2yVgfFz/jJQTdbJYuoZfOlISa4LEBDV2tuv6uNaSG5MmT7xw="
    }
  };

  return NextResponse.json(farcasterConfig);
}
