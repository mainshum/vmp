"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Icons from "./icons";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useToast } from "../hooks/use-toast";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { stringMin3 } from "@/lib/validation";
import { MyInput } from "./forms";
import { useSearchParams } from "next/navigation";
import { ROUTES, SEARCH_PARAMS } from "@/lib/const";
import Link from "next/link";

export interface Props extends React.HTMLAttributes<HTMLDivElement> {}

function SignUpForm({ className, ...rest }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const params = useSearchParams();

  const loginWith = async (...params: Parameters<typeof signIn>) => {
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
    resolver: zodResolver(
      z.object({
        email: stringMin3.refine((s) => s.includes("@"), {
          message: "Email needs to contain @",
        }),
      }),
    ),
    defaultValues: {
      email: "",
    },
  });

  const invalidMail = params.get(SEARCH_PARAMS.invalidMail);

  useEffect(() => {
    if (!invalidMail) return;

    form.setError("email", {
      type: "disabled",
      message: `Unknown user: ${invalidMail}. Register as customer or vendor first.`,
    });
  }, [invalidMail, form]);

  return (
    <div className={cn("flex w-72 flex-col gap-4 pb-4", className)} {...rest}>
      <Icons.logo fill="black" className="mb-4 self-center" />
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(({ email }) =>
            loginWith("email", { email }),
          )}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    {...field}
                    placeholder="example@mail.com"
                    type="email"
                    value={field.value}
                  />
                </FormControl>
                <FormMessage className="pb-3 pt-2" />
              </FormItem>
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
        onClick={() => loginWith("google")}
        disabled={isLoading}
        size="sm"
        variant="outline"
        className="flex w-full items-center gap-2 p-2 text-lg "
      >
        <Icons.linkedin />
        <span>Google</span>
      </Button>
      <section className="flex flex-col items-center pt-3">
        <h4 className="pb-1">Not a user yet?</h4>
        <Link href={ROUTES.REGISTER.CUSTOMER}>Register as Customer</Link>
        <Link href={ROUTES.REGISTER.VENDOR}>Register as Vendor</Link>
      </section>
    </div>
  );
}

export default SignUpForm;
