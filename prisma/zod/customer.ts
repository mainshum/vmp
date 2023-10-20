import * as z from "zod"
import { CompanySize, ProjectFor } from "@prisma/client"

export const CustomerModel = z.object({
  id: z.string().min(3, { message: "Minimum of 3 characters" }),
  companyName: z.string().min(3, { message: "Minimum of 3 characters" }),
  addressLine1: z.string().min(3, { message: "Minimum of 3 characters" }),
  addressLine2: z.string().min(3, { message: "Minimum of 3 characters" }),
  postalCode: z.string().min(3, { message: "Minimum of 3 characters" }),
  city: z.string().min(3, { message: "Minimum of 3 characters" }),
  taxId: z.string().min(3, { message: "Minimum of 3 characters" }),
  name: z.string().min(3, { message: "Minimum of 3 characters" }),
  surname: z.string().min(3, { message: "Minimum of 3 characters" }),
  position: z.string().min(3, { message: "Minimum of 3 characters" }),
  mail: z.string().min(3, { message: "Minimum of 3 characters" }),
  phone: z.string().min(3, { message: "Minimum of 3 characters" }),
  companySize: z.nativeEnum(CompanySize),
  projectFor: z.nativeEnum(ProjectFor),
})
