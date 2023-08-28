"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";
import Icons from "./icons";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {}

function SignUpForm({ className, ...rest }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const loginWithLinkedin = () => {
    setIsLoading(true);

    signIn("google")
      .catch(() =>
        toast({
          title: "Auth error",
          description: "Error authenticating with LinkedIn",
        }),
      )
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={cn("flex gap-1", className)} {...rest}>
      <Button
        onClick={loginWithLinkedin}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="m-2 flex w-full items-center gap-2 p-2 text-lg "
      >
        <Icons.linkedin />
        <span>Google</span>
      </Button>
    </div>
  );
}

export default SignUpForm;
