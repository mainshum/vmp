import { getVMPSession } from "@/lib/auth";
import { RequestForm } from "../../../components/create-request";

async function Page() {
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
