import { WorkType } from "@prisma/client";
import { z } from "zod";
import { positiveInteger15 } from "./prisma-extensions";
import { RequestModel } from "../../prisma/zod/request";

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

export const commercialsSchema = RequestModel.pick({
  profile: true,
  hourlyRate: true,
  availability: true,
  startDate: true,
  endDate: true,
  noticePeriod: true,
  domesticTravel: true,
  internationalTravel: true,
}).extend({
  workType: workSchema,
});

export const projectSchema = RequestModel.pick({
  name: true,
  description: true,
  pmExists: true,
  fundingGuaranteed: true,
  projectStage: true,
  projectDuration: true,
  projectMethodology: true,
});

export const RequestModelPayload = commercialsSchema.merge(projectSchema);
export type RequestModelPayload = z.infer<typeof RequestModelPayload>;
