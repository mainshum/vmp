import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const db = new PrismaClient();

const opsCnt = 20;
const offersPerOp = 3;

async function main() {
  // cleanup
  await db.offer.deleteMany({});
  await db.opportunity.deleteMany({});

  // add opsCnt opportunities with 10 offers each
  const ops = await Promise.all(
    Array(opsCnt)
      .fill(null)
      .map(() =>
        db.opportunity.create({
          data: {
            name: faker.animal.cat(),
          },
        }),
      ),
  );

  const offers = await Promise.all(
    ops.flatMap((op) =>
      Array(offersPerOp)
        .fill(null)
        .map(() =>
          db.offer.createMany({
            data: [
              {
                opportunityId: op.id,
                matchingGrade: faker.number.int({ min: 1, max: 5 }),
              },
            ],
          }),
        ),
    ),
  );

  console.log({ ops, offers });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
