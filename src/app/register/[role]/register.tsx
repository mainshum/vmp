"use client";
import { useForm } from "react-hook-form";
import { FormWrapper } from "@/components/form";
import { MyInput } from "@/components/forms";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CreateCustomer } from "@/lib/validation";
import { VMPRole } from "@prisma/client";
import { ROUTES } from "@/lib/const";
import { useRouter } from "next/navigation";

const Client = ({ role }: { role: "CLIENT" | "VENDOR" }) => {
  const form = useForm({
    resolver: zodResolver(CreateCustomer),
    defaultValues: {
      email: "",
      name: "",
      role: role,
    },
  });

  const { toast } = useToast();

  const router = useRouter();

  const { mutate } = trpc.users.createCustomer.useMutation({
    onError(error) {
      if (error.message === "EMAIL")
        return form.setError("email", {
          message: "This email is already in use",
          type: "deps",
        });

      return toast({ title: `Unexpected error occured` });
    },
    onSuccess() {
      toast({ title: "Registration succesful. Redirecting to login page" });
      router.push(ROUTES.SIGIN);
    },
  });
  return (
    <Form {...form}>
      <FormWrapper onSubmit={form.handleSubmit((xs) => mutate(xs))}>
        <MyInput
          description="Email will be used to log in and for identification purposes."
          control={form.control}
          label="Email address"
          name="email"
          placeholder="example@mail.com"
        />
        <MyInput
          control={form.control}
          label="Name and surname"
          name="name"
          placeholder=""
        />
        <Button type="submit">Save user</Button>
      </FormWrapper>
    </Form>
  );
};

export const RegisterCustomer = () => <Client role={VMPRole.CLIENT} />;
export const RegisterVendor = () => <Client role={VMPRole.VENDOR} />;
