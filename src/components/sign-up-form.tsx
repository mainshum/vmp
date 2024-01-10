"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Icons from "./icons";
import { signIn } from "next-auth/react";
import { useState } from "react";
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
    resolver: zodResolver(
      z.object({
        email: stringMin3,
      }),
    ),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className={cn("flex w-72 flex-col gap-4 pb-4", className)} {...rest}>
      <Icons.logo fill="black" className="mb-4 self-center" />
      <Form {...form}>
        <form
          noValidate
          onSubmit={form.handleSubmit(({ email }) =>
            signIn("email", { email }),
          )}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="example@mail.com"
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
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
