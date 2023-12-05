import * as z from "zod"
import * as imports from "../../src/types/prisma-extensions"
import { RequestStatus, WorkType, ProjectStage, ProjectDuration, ProjectMethodology, JobProfile } from "@prisma/client"
import { CompleteOffer, RelatedOfferModel } from "./index"

export const RequestModel = z.object({
  id: z.string().cuid(),
  validUntil: z.date({ coerce: true }),
  creationDate: z.date({ coerce: true }),
  status: z.nativeEnum(RequestStatus),
  name: z.string().min(3, { message: "Minimum of 3 characters" }),
  workType: z.nativeEnum(WorkType),
  projectStage: z.nativeEnum(ProjectStage),
  projectDuration: z.nativeEnum(ProjectDuration),
  projectMethodology: z.nativeEnum(ProjectMethodology),
  fundingGuaranteed: z.boolean(),
  pmExists: z.boolean(),
  description: z.string().min(10, { message: "Minimum 10 characters" }),
  profile: z.nativeEnum(JobProfile),
  hourlyRate: imports.positiveInteger.int(),
  availability: z.number().int().positive({ message: "Needs to be a positive integer" }),
  startDate: z.date({ coerce: true, required_error: "Start date is required" }),
  endDate: z.date({ coerce: true, required_error: "End date is required" }),
  noticePeriod: imports.positiveInteger.int(),
  officeLocation: z.string().min(3, { message: "Minimum of 3 characters" }).nullish(),
  daysInOffice: imports.positiveInteger15.int().nullish(),
  domesticTravel: z.boolean(),
  internationalTravel: z.boolean(),
})

export interface CompleteRequest extends z.infer<typeof RequestModel> {
  offers: CompleteOffer[]
}

/**
 * RelatedRequestModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRequestModel: z.ZodSchema<CompleteRequest> = z.lazy(() => RequestModel.extend({
  offers: RelatedOfferModel.array(),
}))
