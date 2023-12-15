import SignUpForm from "@/components/sign-up-form";
import Link from "next/link";

async function Page() {
  return (
    <div className="center-absolute">
      <div className="flex h-full w-[500px] flex-col items-center justify-center gap-2">
        <SignUpForm />
        <p className="text-sm text-zinc-700">
          New to VMP?{" "}
          <Link
            className="underline underline-offset-4 hover:text-zinc-800"
            href="/sign-up"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Page;
