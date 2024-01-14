import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/const";
import { RegisterCustomer, RegisterVendor } from "./register";

const Page = ({ params }: { params: { role: string } }) => {
  const role = params.role.toLowerCase();

  if (role !== "vendor" && role !== "customer") return redirect(ROUTES.ROOT);

  return role === "customer" ? <RegisterCustomer /> : <RegisterVendor />;
};

export default Page;
