import { VMPRole } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const noop = () => {};

export function getBaseUrl() {
  const vc = process.env.VERCEL_URL;

  return vc ? `https://${vc}` : "http://localhost:3000";
}

export const capitalize = (s: string) => {
  if (s.length === 0) return "";

  return s[0].toUpperCase() + s.slice(1, s.length);
};

export const startViewTransitionIfExists = (fn: CallableFunction) => {
  if (!document.startViewTransition) {
    fn();
    return;
  }

  document.startViewTransition(fn);
};

class MyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class RoleNotImplementedError extends MyError {
  constructor(role: VMPRole) {
    super(`Role not implemented for ${role}`);
  }
}

export const withTransitionIfExists = (fn: CallableFunction) => {
  if (!document.startViewTransition) {
    fn();
    return;
  }

  document.startViewTransition(fn);
};
