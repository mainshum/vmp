import {
  RequestStatus,
  WorkType,
  ProjectStage,
  ProjectDuration,
  ProjectMethodology,
  JobProfile,
  JobSubProfile,
  Seniority,
  Offer,
  OfferPayload,
} from "@prisma/client";
import { z } from "zod";

export const positiveInteger = z
  .number({ coerce: true })
  .int()
  .positive({ message: "Needs to be a positive integer" });

export const positiveInteger15 = positiveInteger
  .min(1, { message: "Integer in range (1-5)" })
  .max(5, { message: "Integer in range (1-5)" });

export const availabilitySlider = z.number({ coerce: true });

export const requestId = z.string().cuid();
export const nanoidGenerated = z.string().regex(/^[a-zA-Z0-9_-]{21}$/);

export const stringMin3 = z
  .string()
  .min(3, { message: "Minimum length of 3 characters" });

export const emptyStringLiteral = z.literal("");

const RequestOfferShared = z.object({
  profile: z.nativeEnum(JobProfile),
  subProfile: z.nativeEnum(JobSubProfile),
  seniority: z.nativeEnum(Seniority),
  startDate: z.date({
    coerce: true,
    required_error: "Start date is required",
  }),
});

export const RequestInput = z
  .object({
    status: z.nativeEnum(RequestStatus),
    name: z.string().min(3, { message: "Minimum of 3 characters" }),
    workType: z.nativeEnum(WorkType),
    projectStage: z.nativeEnum(ProjectStage),
    projectDuration: z.nativeEnum(ProjectDuration),
    projectMethodology: z.nativeEnum(ProjectMethodology),
    fundingGuaranteed: z.boolean(),
    pmExists: z.boolean(),
    description: z.string().min(10, { message: "Minimum 10 characters" }),
    hourlyRate: positiveInteger,
    availability: z
      .number()
      .int()
      .positive({ message: "Needs to be a positive integer" }),
    endDate: z.date({ coerce: true, required_error: "End date is required" }),
    noticePeriod: positiveInteger,
    officeLocation: z.any(),
    daysInOffice: z.any(),
    domesticTravel: z.boolean(),
    internationalTravel: z.boolean(),
    technical: z.any().refine(
      () => {
        return true;
      },
      { message: "Technical validation failed", path: ["technical"] },
    ),
  })
  .extend(RequestOfferShared.shape)
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
  });

export type RequestInput = z.infer<typeof RequestInput>;

export const OfferInput = RequestOfferShared.extend({
  id: nanoidGenerated,
  requestId: requestId,
  cv: z.string().min(1, { message: "Choose CV file" }),
});

export type OfferInput = z.infer<typeof OfferInput>;
