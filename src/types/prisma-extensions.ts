import { z } from "zod";
import { RequestModel } from "../../prisma/zod";

export const RequestModelPayload = RequestModel.omit({ id: true });
export type RequestModelPayload = z.infer<typeof RequestModelPayload>;
