import { useCommonRedirects as useRoleGuard } from "@/hooks/use-common-redirects";
import { getVMPSession } from "@/lib/auth";
import { ROUTES } from "@/lib/const";
import { RoleNotImplementedError } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";
import { match } from "ts-pattern";
import RoleSelect from "./stuff";

async function Page() {
  let session = await getVMPSession();

  session = useRoleGuard(session);

  return match(session.user.role)
    .with("NONE", () => <RoleSelect />)
    .with("CLIENT", () => redirect(ROUTES.CUSTOMER.REQUESTS))
    .otherwise((r) => {
      throw new RoleNotImplementedError(r);
    });
}

export default Page;
