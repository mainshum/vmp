import * as z from "zod"
import * as imports from "../../src/types/prisma-extensions"
import { OfferStatus } from "@prisma/client"
import { CompleteRequest, RelatedRequestModel } from "./index"

export const OfferModel = z.object({
  id: z.string(),
  matchingGrade: z.number().int().nullish(),
  offerStatus: z.nativeEnum(OfferStatus),
  validUntil: z.date().nullish(),
  creationDate: z.date().nullish(),
  requestId: z.string(),
})

export interface CompleteOffer extends z.infer<typeof OfferModel> {
  request?: CompleteRequest | null
}

/**
 * RelatedOfferModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedOfferModel: z.ZodSchema<CompleteOffer> = z.lazy(() => OfferModel.extend({
  request: RelatedRequestModel.nullish(),
}))
