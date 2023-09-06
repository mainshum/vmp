import { z } from "zod";

const minToCharsString = z.string().min(2, {
  message: "At least 2 characters.",
});

export const companyDetails = z.object({
  companyName: minToCharsString,
  address: minToCharsString,
  taxId: minToCharsString,
  ndaPerson: minToCharsString,
});

export const devProjectType = [
  "New project",
  "Current project",
  "Consulting (expertise)",
] as const;

export const companyType = [
  "My company (internal support)",
  "Project for a different company",
] as const;

export const companySize = [
  "BELOW10",
  "FROM11TO50",
  "FROM50TO250",
  "FROM250TO1000",
  "ABOVE1000",
] as const;

export const questionaire = z.object({
  devProjectType: z.enum(devProjectType),
  companyType: z.enum(companyType),
  companySize: z.enum(companySize),
});

export const buyerRepr = z.object({
  name: minToCharsString,
  surname: minToCharsString,
  position: minToCharsString,
  mail: minToCharsString,
  phone: minToCharsString,
});

export const validCustomer = buyerRepr
  .merge(questionaire)
  .merge(companyDetails);
