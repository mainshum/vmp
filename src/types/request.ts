import { z } from "zod";
import { stringMin3, positiveInteger15 } from "./prisma-extensions";
import { RequestModel } from "zod-types";

export type RequestModel = z.infer<typeof RequestModel>;

// form internal representation
export const RequestFormModel = RequestModel.omit({
  id: true,
  creationDate: true,
  validUntil: true,
})
  .extend({
    daysInOffice: z.any(),
    officeLocation: z.any(),
  })
  .transform(({ ...rest }, ctx) => {
    if (rest.workType === "FULLY_REMOTE")
      return { ...rest, daysInOffice: null, officeLocation: null };

    const ol = stringMin3.safeParse(rest.officeLocation);
    const dio = positiveInteger15.safeParse(rest.daysInOffice);

    if (!ol.success) {
      ctx.addIssue({
        path: ["officeLocation"],
        message: ol.error.issues[0].message,
        code: "custom",
      });
    }

    if (rest.workType === "HYBRID" && !dio.success) {
      ctx.addIssue({
        path: ["daysInOffice"],
        message: dio.error.issues[0].message,
        code: "custom",
      });
    }

    return {
      ...rest,
      daysInOffice: dio.success ? dio.data : null,
      officeLocation: ol.success ? ol.data : null,
    };
  });

export type RequestFormModel = z.infer<typeof RequestFormModel>;
