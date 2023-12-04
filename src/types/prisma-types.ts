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

export type MutationRequest = Omit<
  Request,
  "id" | "validUntil" | "creationDate" | "status"
>;
export type RequestFormValues = Omit<MutationRequest, "status" | "id">;

// db level
export const pendingSchema = z
  .object({
    name: stringMin3,
    description: stringMin3,
    hourlyRate: positiveInteger,
    availability: positiveInteger,
    noticePeriod: positiveInteger,
    workType: z.nativeEnum(WorkType),
    startDate: z.date({ coerce: true }),
    officeLocation: z.any(),
    daysInOffice: z.any(),
    endDate: z.date({ coerce: true }),
    domesticTravel: z.boolean(),
    internationalTravel: z.boolean(),
    pmExists: z.boolean(),
    fundingGuaranteed: z.boolean(),
    profile: z.nativeEnum(JobProfile),
    projectStage: z.nativeEnum(ProjectStage),
    projectDuration: z.nativeEnum(ProjectDuration),
    projectMethodology: z.nativeEnum(ProjectMethodology),
  })
  .transform(({ ...rest }, ctx) => {
    if (rest.workType === "FULLY_REMOTE")
      return { ...rest, daysInOffice: null, officeLocation: null };

    const ol = stringMin3.safeParse(rest.officeLocation);
    const dio = positiveInteger15.safeParse(rest.daysInOffice);

    if (!ol.success) {
      ctx.addIssue({
        path: ["officeLocation"],
        message: ol.error.issues[0].message,
        code: "custom",
      });
    }

    if (rest.workType === "HYBRID" && !dio.success) {
      ctx.addIssue({
        path: ["daysInOffice"],
        message: dio.error.issues[0].message,
        code: "custom",
      });
    }

    return {
      ...rest,
      daysInOffice: dio.success ? dio.data : null,
      officeLocation: ol.success ? ol.data : null,
    };
  }) satisfies z.Schema<MutationRequest, any, any>;

const elseNull = z.any().transform(() => null);

export const draftSchema = z
  .object({
    name: stringMin3,
    description: z.string().or(elseNull),
    hourlyRate: z.number().or(elseNull),
    availability: z.number().or(elseNull),
    noticePeriod: z.number().or(elseNull),
    workType: z.nativeEnum(WorkType).or(elseNull),
    daysInOffice: z.number().or(elseNull),
    officeLocation: z.string().or(elseNull),
    startDate: z.date({ coerce: true }).or(elseNull),
    endDate: z.date({ coerce: true }).or(elseNull),
    domesticTravel: z.boolean(),
    internationalTravel: z.boolean(),
    pmExists: z.boolean(),
    fundingGuaranteed: z.boolean(),
    profile: z.nativeEnum(JobProfile).or(elseNull),
    projectStage: z.nativeEnum(ProjectStage).or(elseNull),
    projectDuration: z.nativeEnum(ProjectDuration).or(elseNull),
    projectMethodology: z.nativeEnum(ProjectMethodology).or(elseNull),
  })
  .transform((xs) => ({ ...xs, status: "DRAFT" })) satisfies z.Schema<
  MutationRequest,
  any,
  any
>;

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
