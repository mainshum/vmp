import { draftSchema } from "@/types/prisma-types";
import { ROUTES } from "./const";
import { getBaseUrl } from "./utils";
import { RequestModel } from "zod-types";

export const getRequest = async (id: string) => {
  return await fetch(`${getBaseUrl()}${ROUTES.API.CUSTOMER.REQUESTS.ONE(id)}`, {
    cache: "no-store",
  })
    .then((res) => res.json())
    .then(RequestModel.parse);
};
