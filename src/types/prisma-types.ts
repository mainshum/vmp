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
  RequestStatus,
} from "@prisma/client";
import { z } from "zod";
import {
  positiveInteger,
  positiveInteger15,
  stringMin3,
} from "./prisma-extensions";
import { NullableFields, UDef } from "./shared";

export type OutputPending = Omit<
  Request,
  "id" | "validUntil" | "creationDate" 
>;

export type OutputDraft = NullableFields<OutputPending>;

export type InputPendingDraft = UDef<
  Omit<OutputPending, "daysInOffice" | "workType" | "officeLocation" | "status">
>;

export type RequestMutationBody = OutputDraft & { status: "DRAFT" | "PENDING" };

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

const transformWork = (x: z.infer<typeof workSchema>) => ({
  workType: x.workType,
  officeLocation: x.workType !== "FULLY_REMOTE" ? x.officeLocation : null,
  daysInOffice: x.workType === "HYBRID" ? x.daysInOffice : null,
});

// form validation
export const pendingRequestSchema = z
  .object({
    name: stringMin3,
    description: stringMin3,
    hourlyRate: positiveInteger,
    availability: positiveInteger,
    noticePeriod: positiveInteger,
    startDate: z.date({ coerce: true }),
    endDate: z.date({ coerce: true }),
    domesticTravel: z.boolean(),
    internationalTravel: z.boolean(),
    pmExists: z.boolean(),
    fundingGuaranteed: z.boolean(),
    workSchema: workSchema,
    profile: z.nativeEnum(JobProfile),
    projectStage: z.nativeEnum(ProjectStage),
    projectDuration: z.nativeEnum(ProjectDuration),
    projectMethodology: z.nativeEnum(ProjectMethodology),
  })
  .transform((x) => ({
    ...x,
    ...transformWork(x.workSchema),
    status: 'PENDING'
  })) satisfies z.Schema<OutputPending, any, InputPendingDraft>;

export const draftRequestSchema = z
  .object({
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
  })
  .transform((x) => ({
    ...x,
    ...transformWork(x.workSchema),
    status: 'DRAFT'
  })) satisfies z.ZodSchema<OutputDraft, any, InputPendingDraft>;

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
