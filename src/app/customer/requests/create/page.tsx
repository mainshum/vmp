import { RequestForm } from "@/app/customer/requests/create/request-form";
import { db } from "@/lib/db";
import { RequestModel } from "zod-types";

const getRequest = async (id: string) => {
  const res = await db.request.findFirst({
    where: {
      id: id,
    },
  });

  return RequestModel.parse(res);
};

async function RequestCreate({
  searchParams,
}: {
  searchParams: { requestId: string };
}) {
  if (!searchParams.requestId) return <RequestForm />;

  const data = await getRequest(searchParams.requestId);

  return <RequestForm initRequest={data} />;
}

export default RequestCreate;
