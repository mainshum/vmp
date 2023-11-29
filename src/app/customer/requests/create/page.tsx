import { RequestForm } from "@/components/create-request";
import SideNav from "@/components/side-nav";

function RequestCreate() {
  return (
    <div className="py-8 pr-80">
      <RequestForm />
      <SideNav className="pt-8">
        <h1>On this page</h1>
        <p>Consultant&apos;profile</p>
        <p>Consultant&apos;profile</p>
        <p>Consultant&apos;profile</p>
      </SideNav>
    </div>
  );
}

export default RequestCreate;
