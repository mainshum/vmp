import { CompanyForm } from "../forms";
import { getVMPSession } from "@/lib/auth";
import { ROUTES } from "@/lib/const";
import { db } from "@/lib/db";
import getQueryClient from "@/lib/queryClient";
import { getBaseUrl } from "@/lib/utils";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { Session } from "next-auth";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
// import DemoForm from "@/components/demo-form";

const wrapGetSession = async (): Promise<Session> => {
  const session = await getVMPSession();

  if (!session) redirect(ROUTES.SIGIN);

  return session;
};

async function Page() {

  const client = getQueryClient();

  const getSettings = async () => {

    return fetch(getBaseUrl() + "/api/client/settings", {
      method: 'GET',
      headers: {
        Cookie: cookies().toString(),
      }
    }).then(res => res.json());
  }

  await client.prefetchQuery(['client.settings'], getSettings)

  const state = dehydrate(client);

  return <Hydrate state={state}>
    <CompanyForm />
  </Hydrate>
}

export default Page;
