import { RequestFormModel } from "@/types/request";
import { ROUTES } from "./const";
import { getBaseUrl } from "./utils";
import { RequestModel } from "zod-types";
import { z } from "zod";

export const RequestClient = {
  get: async (id: string) => {
    return await fetch(`${getBaseUrl()}${ROUTES.API.CUSTOMER.REQUESTS.PUT(id)}`)
      .then((res) => res.json())
      .then(RequestModel.parse);
  },
  getAll: async () => {
    return await fetch(`${getBaseUrl()}${ROUTES.API.CUSTOMER.REQUESTS.LIST}`)
      .then((res) => res.json())
      .then(z.array(RequestModel).parse);
  },
  post: async (req: RequestFormModel) => {
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
  },
  put: async (id: string, req: RequestFormModel) => {
    const res = await fetch(
      `${getBaseUrl()}${ROUTES.API.CUSTOMER.REQUESTS.PUT(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(req),
      },
    );

    const json = await res.json();

    if (res.status !== 200) throw new Error(json);

    return json;
  },
  delete: async (id: string) => {
    const res = await fetch(ROUTES.API.CUSTOMER.REQUESTS.DELETE(id), {
      method: "DELETE",
    });

    if (res.status !== 200) throw new Error("Delete failed");

    return Promise.resolve();
  },
};
