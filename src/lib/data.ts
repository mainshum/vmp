import { RequestFormModel } from "@/types/request";
import { ROUTES } from "./const";
import { getBaseUrl } from "./utils";
import { RequestModel } from "zod-types";

export const getRequest = async (id: string) => {
  return await fetch(`${getBaseUrl()}${ROUTES.API.CUSTOMER.REQUESTS.PUT(id)}`)
    .then((res) => res.json())
    .then(RequestModel.parse);
};

export const postNewRequest = async (req: RequestFormModel) => {
  const res = await fetch(
    `${getBaseUrl()}${ROUTES.API.CUSTOMER.REQUESTS.POST}`,
    {
      method: "POST",
      body: JSON.stringify(req),
    },
  );

  const json = await res.json();

  if (res.status !== 200) throw new Error(json);

  return json;
};
