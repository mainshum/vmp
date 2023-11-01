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
import { EnumLike, number, z } from "zod";
import {
  positiveInteger,
  positiveInteger15,
  stringMin3,
} from "./prisma-extensions";
import { FormPrep } from "./shared";

export type MutationRequest = Omit<
  Request,
  "id" | "validUntil" | "creationDate"
>;
export type RequestFormValues = FormPrep<
  Omit<MutationRequest, "status" | "id">
>;

const addStatus = (status: RequestStatus) => {
  return function addExtras<T>(t: T) {
    return { ...t, status };
  };
};

const anyStringOrNullIfEmpty = z
  .string()
  .transform((x) => (x === "" ? null : x));

const draftNumberSchema = z
  .number({ coerce: true })
  .transform((x) => (x === 0 ? null : x));

function enumWithLiteralErrorMapped<T extends EnumLike>(t: T) {
  return z.nativeEnum(t, {
    errorMap: (issue, ctx) => {
      if (issue.code === "invalid_enum_value" && issue.received === "")
        return { message: "Required" };

      return { message: ctx.defaultError };
    },
  });
}

// db level
export const pendingSchema = z
  .object({
    name: stringMin3,
    description: stringMin3,
    hourlyRate: positiveInteger,
    availability: positiveInteger,
    noticePeriod: positiveInteger,
    workType: enumWithLiteralErrorMapped(WorkType),
    daysInOffice: positiveInteger15,
    officeLocation: z.string(),
    startDate: z.date({ coerce: true }),
    endDate: z.date({ coerce: true }),
    domesticTravel: z.boolean(),
    internationalTravel: z.boolean(),
    pmExists: z.boolean(),
    fundingGuaranteed: z.boolean(),
    profile: enumWithLiteralErrorMapped(JobProfile),
    projectStage: enumWithLiteralErrorMapped(ProjectStage),
    projectDuration: enumWithLiteralErrorMapped(ProjectDuration),
    projectMethodology: enumWithLiteralErrorMapped(ProjectMethodology),
  })
  .transform(addStatus("PENDING")) satisfies z.Schema<
  MutationRequest,
  any,
  RequestFormValues
>;

const emptyStringIntoNull = z.literal("").transform(() => null);

export const draftSchema = z
  .object({
    name: stringMin3,
    description: anyStringOrNullIfEmpty,
    hourlyRate: draftNumberSchema,
    availability: draftNumberSchema,
    noticePeriod: draftNumberSchema,
    workType: z.nativeEnum(WorkType).or(emptyStringIntoNull),
    daysInOffice: draftNumberSchema,
    officeLocation: anyStringOrNullIfEmpty,
    startDate: z.date({ coerce: true }).or(emptyStringIntoNull),
    endDate: z.date({ coerce: true }).or(emptyStringIntoNull),
    domesticTravel: z.boolean(),
    internationalTravel: z.boolean(),
    pmExists: z.boolean(),
    fundingGuaranteed: z.boolean(),
    profile: z.nativeEnum(JobProfile).or(emptyStringIntoNull),
    projectStage: z.nativeEnum(ProjectStage).or(emptyStringIntoNull),
    projectDuration: z.nativeEnum(ProjectDuration).or(emptyStringIntoNull),
    projectMethodology: z
      .nativeEnum(ProjectMethodology)
      .or(emptyStringIntoNull),
  })
  .transform(addStatus("DRAFT")) satisfies z.Schema<
  MutationRequest,
  any,
  RequestFormValues
>;

// .superRefine(({workType, officeLocation, daysInOffice}, ctx) => {
//     match(workType)
//       .with('ONSITE', () => {
//         const ol = stringMin3.safeParse(officeLocation);

//         if (!ol.success)
//           ctx.addIssue({path: ['officeLocation'], code: z.ZodIssueCode.custom, message: ol.error.message})
//       })
//       .with('HYBRID', () => {
//         const ol = stringMin3.safeParse(officeLocation);
//         const dof = stringMin3.safeParse(daysInOffice);

//         if (!ol.success)
//           ctx.addIssue({path: ['officeLocation'], code: z.ZodIssueCode.custom, message: ol.error.message})

//         if (!dof.success)
//           ctx.addIssue({path: ['daysInOffice'], code: z.ZodIssueCode.custom, message: dof.error.message})
//       })
//   })

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
