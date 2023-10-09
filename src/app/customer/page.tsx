import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getBaseUrl } from "@/lib/utils";
import { PageParams } from "@/types/next";
import { Opportunity } from "../../../prisma/generated/zod";

const getPostings = (): Promise<Opportunity[]> => {
  const as = Array(11)
    .fill(null)
    .map(
      (_, id): Opportunity => ({
        id: id.toString(),
        name: `siem`,
        status: "PENDING",
        creationDate: null,
        validUntil: null,
      }),
    );

  return Promise.resolve(as);
};

async function PageServer({ searchParams }: PageParams) {
  const url = new URL(`${getBaseUrl()}/api/postings`);

  const postings = await getPostings();

  if (searchParams["mockstate"])
    url.searchParams.set("mockstate", searchParams["mockstate"] as string);

  return (
    <>
      <section className="flex items-center justify-between py-8">
        <Table>
          <TableRow>
            <TableHeader>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Valid until</TableHead>
              <TableHead>Creation date</TableHead>
            </TableHeader>
          </TableRow>
          <TableBody>
            {postings.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section></section>
    </>
  );
}

export default PageServer;
