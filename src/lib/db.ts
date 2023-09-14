import { PrismaClient } from "@prisma/client";
import "server-only";

declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}

// prisma.$extends({
//   query: {
//     customer: {
//       create({ args, query }) {
//         // validate

//         args.data = CustomerSchema.omit({ id: true }).parse(args.data);

//         return query(args);
//       },
//     },
//   },
// });

export const db = prisma;
