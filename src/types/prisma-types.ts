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

type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

const workSchema = z.discriminatedUnion("workType", [
  z.object({ workType: z.literal(WorkType.FULLY_REMOTE) }),
  z.object({
    workType: z.literal(WorkType.ONSITE),
    officeLocation: z.string().min(3),
  }),
  z.object({
    workType: z.literal(WorkType.HYBRID),
    daysInOffice: positiveInteger15,
    officeLocation: z.string().min(3),
  }),
]);

type CommercialsSchema = NonNullableFields<
  Pick<
    Request,
    | "profile"
    | "hourlyRate"
    | "availability"
    | "startDate"
    | "endDate"
    | "noticePeriod"
    | "domesticTravel"
    | "internationalTravel"
  > & { workSchema: z.infer<typeof workSchema> }
>;

type ProjectSchema = NonNullableFields<
  Pick<
    Request,
    | "name"
    | "description"
    | "pmExists"
    | "fundingGuaranteed"
    | "projectStage"
    | "projectDuration"
    | "projectMethodology"
  >
>;

type RequestDraftInput = Partial<Request> & { status: "DRAFT" | "PENDING" };

// validate commercials form
export const commercialsSchema = z.object({
  workSchema: workSchema,
  profile: z.nativeEnum(JobProfile),
  hourlyRate: positiveInteger,
  availability: z
    .number()
    .int()
    .positive({ message: "Needs to be a positive integer" }),
  startDate: z.date({ coerce: true, required_error: "Start date is required" }),
  endDate: z.date({ coerce: true, required_error: "End date is required" }),
  noticePeriod: positiveInteger,
  domesticTravel: z.boolean(),
  internationalTravel: z.boolean(),
}) satisfies z.ZodType<CommercialsSchema>;

// validate project form
export const projectSchema = z.object({
  name: stringMin3,
  description: stringMin3,
  pmExists: z.boolean(),
  fundingGuaranteed: z.boolean(),
  projectStage: z.nativeEnum(ProjectStage),
  projectDuration: z.nativeEnum(ProjectDuration),
  projectMethodology: z.nativeEnum(ProjectMethodology),
}) satisfies z.ZodType<ProjectSchema>;

export const requestPayloadBody = projectSchema
  .partial()
  .merge(commercialsSchema.partial())
  .merge(
    z.object({
      status: z.union([z.literal("DRAFT"), z.literal("PENDING")]),
    }),
  )
  .strict() satisfies z.ZodType<RequestDraftInput>;

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
