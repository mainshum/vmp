import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  const vc = process.env.VERCEL_URL;

  const baseUrl = vc ? `https://${vc}` : "http://localhost:3000";

  console.log("base url", baseUrl);

  return baseUrl;
}
