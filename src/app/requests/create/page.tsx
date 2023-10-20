import { getVMPSession } from "@/lib/auth";
import { RequestForm } from "./form";
import { headers, cookies } from "next/headers";

async function Page(...xs: any) {
  console.log(cookies());

  //console.log(process.env);
  const session = await getVMPSession();

  //if (!session) redirect("/");

  return (
    <div className="py-8">
      <RequestForm />
    </div>
  );
}

export default Page;
