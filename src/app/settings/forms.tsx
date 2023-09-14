"use client";
import type { Customer } from "@prisma/client";
import * as F from "@/components/register";
import { Form } from "@/components/ui/form";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/const";
import { useToast } from "@/hooks/use-toast";
import { FieldValues, UseFormReturn } from "react-hook-form";

import {
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

function Submit({ isEnabled }: { isEnabled: boolean }) {
  return (
    <div className="flex justify-center">
      <Button disabled={!isEnabled} type="submit">
        Save changes
      </Button>
    </div>
  );
}

function CustomerPartialForm<T extends FieldValues>({
  form,
  customerId,
  children,
}: {
  form: UseFormReturn<T>;
  customerId: string;
  children: React.ReactNode;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  //const queryClient = useQueryClient();

  const update = (xs: T) => {
    setIsSaving(true);

    return fetch("/api/client/settings", {
      method: "PUT",
      body: JSON.stringify({
        id: customerId,
        ...xs,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          toast({ title: "Changes saved" });
        } else {
          toast({ title: "Unexpected error occured" });
        }
      })
      .finally(() => setIsSaving(false));
  };

  // mutation
  const mutation = useMutation({
    mutationFn: update,
  });

  const submittable =
    !isSaving && form.formState.isDirty && form.formState.isValid;

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((xs) => mutation.mutate(xs))}
      >
        {children}
        <Submit isEnabled={submittable} />
      </form>
    </Form>
  );
}

function useData(initialData: Customer) {
  const q = useQuery({
    initialData,
  });
}

export function CompanyForm() {
  const client = useQueryClient();
  const { data } = useQuery({
    queryKey: ["client.settings"],

    queryFn: () =>
      fetch("/api/client/settings")
        .then((js) => {
          return js.json();
        })
        .then((data) => {
          console.log(data);
          return data;
        }),
  });

  console.log(data);

  const update = (xs: Customer) => {
    setIsSaving(true);

    return fetch(ROUTES.API.CLIENT_REGISTER, {
      method: "PUT",
      body: JSON.stringify({
        ...xs,
        id: data!.id,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          // toast({ title: "Changes saved" });
        } else {
          // toast({ title: "Unexpected error occured" });
        }
      })
      .finally(() => setIsSaving(false));
  };

  const m = useMutation({
    mutationFn: update,
    onSuccess() {
      console.log("invalidating");
      client.invalidateQueries({ queryKey: ["client.settings"] });
    },
  });

  const form = F.useCompanyForm({
    defaultValues: data,
    values: data,
  });

  const [isSaving, setIsSaving] = useState(false);

  const submittable =
    !isSaving && form.formState.isDirty && form.formState.isValid;

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((xs) => m.mutate(xs))}
      >
        <F.CompanyDetails form={form} />;
        <Submit isEnabled={submittable} />
      </form>
    </Form>
  );
}

export function BuyerForm({ data }: { data: Customer }) {
  const form = F.useBuyerForm(data);

  return (
    <CustomerPartialForm form={form} customerId={data.id}>
      <F.BuyerRepr form={form} />
    </CustomerPartialForm>
  );
}
