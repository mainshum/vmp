import { z } from "zod";

export const positiveInteger = z
  .number({ coerce: true })
  .int()
  .positive({ message: "Needs to be a positive integer" });

export const positiveInteger15 = positiveInteger
  .min(1, { message: "Integer in range (1-5)" })
  .max(5, { message: "Integer in range (1-5)" });

export const availabilitySlider = z.number({ coerce: true });

export const stringMin3 = z
  .string()
  .min(3, { message: "Minimum length of 3 characters" });
