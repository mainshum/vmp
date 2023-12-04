import { EditRequestForm, RequestForm } from "@/components/request-form";
import SideNav from "@/components/side-nav";
import { Children } from "@/types/shared";
import { Circle } from "lucide-react";

const C = () => <Circle fill="black" className="h-2 w-2 " />;

function FormNavigation() {
  return (
    <div className="flex items-baseline gap-4">
      <span className="text-2xl font-bold">Job profile</span>
      <C />
      <span>Technical</span>
      <C />
      <span>Other</span>
    </div>
  );
}

const A = ({ href, children }: { href: string; children: Children }) => (
  <a className="block text-slate-500" href={href}>
    {children}
  </a>
);

function RequestCreate() {
  return (
    <div className="flex justify-center gap-8 px-8 md:justify-between">
      <div className="hidden w-10 shrink-[100] md:block"></div>
      <div className="flex flex-col items-start py-8">
        <FormNavigation />
        <RequestForm />
      </div>
      <SideNav className="sticky top-[56px] h-[calc(100vh-56px)] shrink-0 translate-x-[30px] gap-3 pt-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-semibold">On this page</h1>
          <A href="#profile">Profile</A>
          <A href="#availability">Availability</A>
          <A href="#travel">Travel requirements</A>
          <A href="#project">Project details</A>
        </div>
      </SideNav>
    </div>
  );
}

export default RequestCreate;
