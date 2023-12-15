"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Icons from "./icons";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { Form, FormField } from "./ui/form";
import { Mail } from "lucide-react";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {}

function SignUpForm({ className, ...rest }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const loginWith = async (params: Parameters<typeof signIn>) => {
    setIsLoading(true);

    try {
      await signIn(...params);
    } catch (error) {
      toast({
        title: "Auth error",
        description: "Error authenticating with Google",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<{ email: string }>({
    defaultValues: {
      email: "",
    },
  });

  return (
    <div
      className={cn("flex flex-col items-center gap-3 pb-4", className)}
      {...rest}
    >
      <Icons.logo fill="black" />
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(({ email }) =>
            signIn("email", { email }),
          )}
          className="space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <Input placeholder="hello@mail.com" {...field} />
            )}
          />
          <Button
            disabled={isLoading}
            type="submit"
            variant="outline"
            className="flex w-full items-center gap-2 p-2 text-lg "
          >
            <Mail className="h-6 w-6" />
            <span>Email</span>
          </Button>
        </form>
      </Form>
      <Button
        onClick={() => loginWith(["google"])}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="flex w-full items-center gap-2 p-2 text-lg "
      >
        <Icons.linkedin />
        <span>Google</span>
      </Button>
    </div>
  );
}

export default SignUpForm;
