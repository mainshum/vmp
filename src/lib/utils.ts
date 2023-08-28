import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  const vc = process.env.VERCEL_URL;

  return vc ? `https://${vc}` : "http://localhost:3000";
}
