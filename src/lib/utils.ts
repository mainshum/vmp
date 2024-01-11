import { JobProfile, JobSubProfile, VMPRole } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { match } from "ts-pattern";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const noop = () => {};

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

export const withTransitionIfExists = (fn: CallableFunction) => {
  if (!document.startViewTransition) {
    fn();
    return;
  }

  document.startViewTransition(fn);
};

export const delay = (time: number) =>
  new Promise((res) => setTimeout(res, time));

export function withMinResolveTime<TVar, TRes>(
  resTime: number,
  // eslint-disable-next-line no-unused-vars
  promise: (vars: TVar) => Promise<TRes>,
) {
  return (vars: TVar) => {
    // eslint-disable-next-line no-unused-vars
    return Promise.all([delay(resTime), promise(vars)]).then(
      ([_a, res]) => res,
    );
  };
}

export const getSubProfile = (profile: JobProfile): JobSubProfile[] =>
  match(profile)
    .with(JobProfile.SOFTWARE_ENGINEER, () => [
      JobSubProfile.BACKEND,
      JobSubProfile.FRONTEND,
      JobSubProfile.FULLSTACK,
      JobSubProfile.MOBILE,
    ])
    .with(JobProfile.DATA_SPECIALIST, () => [])
    .with(JobProfile.DEVOPS, () => [])
    .with(JobProfile.QUALITY_ASSURANCE, () => [])
    .otherwise(() => []);

export const adminOr = (role?: VMPRole) => (r: VMPRole) =>
  r === role || r === "ADMIN";

export const reduceSum = (acc: number, cv: number) => acc + cv;
