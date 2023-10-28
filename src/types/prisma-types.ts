import {
  WorkType,
  Request,
  JobProfile,
  ProjectMethodology,
  ProjectStage,
  ProjectDuration,
  Customer,
  ProjectFor,
  CompanySize,
  Offer,
  OfferStatus,
} from "@prisma/client";
import { z } from "zod";
import {
  positiveInteger,
  positiveInteger15,
  stringMin3,
} from "./prisma-extensions";

const workSchema = z.discriminatedUnion("workType", [
  z.object({ workType: z.literal(WorkType.FULLY_REMOTE) }),
  z.object({
    workType: z.literal(WorkType.ONSITE),
    officeLocation: stringMin3,
  }),
  z.object({
    workType: z.literal(WorkType.HYBRID),
    daysInOffice: positiveInteger15,
    officeLocation: stringMin3,
  }),
]);

export type RequestSchema = Pick<
  Request,
  | "profile"
  | "hourlyRate"
  | "availability"
  | "startDate"
  | "endDate"
  | "noticePeriod"
  | "domesticTravel"
  | "internationalTravel"
  | "name"
  | "description"
  | "pmExists"
  | "fundingGuaranteed"
  | "projectStage"
  | "projectDuration"
  | "projectMethodology"
> & { workSchema: z.infer<typeof workSchema> };

export type RequestMutationInput = Partial<Request> & {
  status: "DRAFT" | "PENDING";
};

type UDef<T> = {
  [P in keyof T]?: T[P] | undefined | string | "";
};

// form validation
export const pendingRequestSchema = z.object({
  name: stringMin3,
  description: stringMin3,
  hourlyRate: positiveInteger,
  availability: positiveInteger,
  noticePeriod: positiveInteger,
  startDate: z.date({ coerce: true, required_error: "Start date is required" }),
  endDate: z.date({ coerce: true, required_error: "End date is required" }),
  domesticTravel: z.boolean(),
  internationalTravel: z.boolean(),
  pmExists: z.boolean(),
  fundingGuaranteed: z.boolean(),
  workSchema: workSchema,
  profile: z.nativeEnum(JobProfile),
  projectStage: z.nativeEnum(ProjectStage),
  projectDuration: z.nativeEnum(ProjectDuration),
  projectMethodology: z.nativeEnum(ProjectMethodology),
}) satisfies z.Schema<NonNullable<RequestSchema>, any, UDef<RequestSchema>>;

export const draftRequestSchema = z.object({
  name: stringMin3,
  description: z.string().or(z.literal("").transform(() => null)),
  hourlyRate: z
    .number({ coerce: true })
    .or(z.literal("").transform(() => null)),
  availability: positiveInteger,
  noticePeriod: z
    .number({ coerce: true })
    .or(z.literal("").transform(() => null)),
  startDate: z
    .date({ coerce: true, required_error: "Start date is required" })
    .or(z.any().transform(() => null)),
  endDate: z
    .date({ coerce: true, required_error: "End date is required" })
    .or(z.any().transform(() => null)),
  domesticTravel: z.boolean(),
  internationalTravel: z.boolean(),
  pmExists: z.boolean(),
  fundingGuaranteed: z.boolean(),
  workSchema: workSchema,
  profile: z.nativeEnum(JobProfile).or(z.any().transform(() => null)),
  projectStage: z.nativeEnum(ProjectStage).or(z.any().transform(() => null)),
  projectDuration: z
    .nativeEnum(ProjectDuration)
    .or(z.any().transform(() => null)),
  projectMethodology: z
    .nativeEnum(ProjectMethodology)
    .or(z.any().transform(() => null)),
}) satisfies z.ZodSchema<RequestSchema, any, UDef<RequestSchema>>;

type CompanySchema = Pick<
  Customer,
  | "companyName"
  | "companySize"
  | "projectFor"
  | "addressLine1"
  | "addressLine2"
  | "postalCode"
  | "city"
  | "taxId"
>;
type BuyerDetailsSchema = Pick<
  Customer,
  "name" | "surname" | "mail" | "phone" | "position"
>;

export const CompanySchema = z.object({
  companyName: stringMin3,
  companySize: z.nativeEnum(CompanySize),
  projectFor: z.nativeEnum(ProjectFor),
  addressLine1: stringMin3,
  addressLine2: stringMin3,
  postalCode: stringMin3,
  city: stringMin3,
  taxId: stringMin3,
}) satisfies z.ZodType<CompanySchema>;

export const BuyerDetailsSchema = z.object({
  name: stringMin3,
  surname: stringMin3,
  mail: stringMin3,
  phone: stringMin3,
  position: stringMin3,
}) satisfies z.ZodType<BuyerDetailsSchema>;

export const OfferSchema = z.object({
  id: z.string().cuid(),
  matchingGrade: z.number(),
  offerStatus: z.nativeEnum(OfferStatus),
  validUntil: z.date({ coerce: true }).nullable(),
  creationDate: z.date({ coerce: true }).nullable(),
  requestId: z.string().cuid(),
}) satisfies z.ZodType<Offer>;
