import SignUpForm from "@/components/sign-up-form";

async function Page() {
  return (
    <div className="center-absolute">
      <div className="flex h-full w-[500px] flex-col items-center justify-center gap-2">
        <SignUpForm />
      </div>
    </div>
  );
}

export default Page;
