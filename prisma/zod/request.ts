import * as z from "zod"
import * as imports from "../../src/types/prisma-extensions"
import { RequestStatus, WorkType, ProjectStage, ProjectDuration, ProjectMethodology, JobProfile } from "@prisma/client"
import { CompleteOffer, RelatedOfferModel } from "./index"

export const RequestModel = z.object({
  id: z.string().cuid(),
  validUntil: z.date().nullish(),
  creationDate: z.date().nullish(),
  status: z.nativeEnum(RequestStatus),
  name: z.string().min(3, { message: "Minimum of 3 characters" }),
  workType: z.nativeEnum(WorkType).nullish(),
  projectStage: z.nativeEnum(ProjectStage).nullish(),
  projectDuration: z.nativeEnum(ProjectDuration).nullish(),
  projectMethodology: z.nativeEnum(ProjectMethodology).nullish(),
  fundingGuaranteed: z.boolean().nullish(),
  pmExists: z.boolean().nullish(),
  description: z.string().min(10, { message: "Minimum 10 characters" }).nullish(),
  profile: z.nativeEnum(JobProfile).nullish(),
  hourlyRate: imports.positiveInteger.int().nullish(),
  availability: z.number().int().positive({ message: "Needs to be a positive integer" }).nullish(),
  startDate: z.date({ coerce: true, required_error: "Start date is required" }).nullish(),
  endDate: z.date({ coerce: true, required_error: "End date is required" }).nullish(),
  noticePeriod: imports.positiveInteger.int().nullish(),
  officeLocation: z.string().nullish(),
  daysInOffice: imports.positiveInteger15.int().nullish(),
  domesticTravel: z.boolean().nullish(),
  internationalTravel: z.boolean().nullish(),
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
