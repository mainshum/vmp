import { z } from "zod";
import { RequestModel } from "zod-types";

export type RequestModel = z.infer<typeof RequestModel>;

export const RequestPostModel = RequestModel.omit({
  id: true,
  creationDate: true,
  validUntil: true,
});

export const RequestPutModel = RequestModel.omit({
  id: true,
  creationDate: true,
  validUntil: true,
}).partial();

export type RequestPreview = {
  id: string;
  status: string;
  name: string;
  validUntil: string;
  creationDate: string;
  offersCount: number;
};

// form internal representation
