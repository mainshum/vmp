import { getVMPSession } from "@/lib/auth";
import { ProfileForm } from "./form";
import { redirect } from "next/navigation";

async function Page() {
  const session = await getVMPSession();

  //if (!session) redirect("/");

  return (
    <div className="py-8">
      <ProfileForm />
    </div>
  );
}

export default Page;
