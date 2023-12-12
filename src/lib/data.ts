import { RequestPostModel, RequestPutModel } from "@/types/request";
import { ROUTES } from "./const";
import { RequestModel } from "zod-types";
import { z } from "zod";

// onlyt to be used on the client
export const RequestClient = {
  get: async (id: string) => {
    return await fetch(ROUTES.API.CUSTOMER.REQUESTS.PUT(id))
      .then((res) => res.json())
      .then(RequestModel.parse);
  },
  getAll: async (prefix: string = "") => {
    return await fetch(`${prefix}${ROUTES.API.CUSTOMER.REQUESTS.LIST}`)
      .then((res) => res.json())
      .then(z.array(RequestModel).parse);
  },
  post: async (req: z.infer<typeof RequestPostModel>) => {
    const res = await fetch(ROUTES.API.CUSTOMER.REQUESTS.POST, {
      method: "POST",
      body: JSON.stringify(req),
    });

    const json = await res.json();

    if (res.status !== 200) throw new Error(json);

    return json;
  },
  put: async (id: string, req: z.infer<typeof RequestPutModel>) => {
    const res = await fetch(ROUTES.API.CUSTOMER.REQUESTS.PUT(id), {
      method: "PUT",
      body: JSON.stringify(req),
    });

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
