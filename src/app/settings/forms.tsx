"use client";
import type { Customer } from "@prisma/client";
import * as F from "@/components/register";
import { Form } from "@/components/ui/form";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Error as E } from "@/components/success";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { match } from "ts-pattern";
import { Loader2 } from "lucide-react";
import { noop } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CompanySizeRadioItems,
  ProjectsForRadioItems,
  RadioGroup,
  SubmitBtn,
} from "@/components/forms";
import * as Typo from "@/components/typography";

const getClientSettings = (): Promise<Customer> =>
  fetch("/api/client/settings").then((js) => js.json());

export function CF({ data }: { data: Customer }) {
  const client = useQueryClient();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const update = (xs: F.CompanySchemaT) => {
    setIsSaving(true);

    return fetch("/api/customer/register", {
      method: "PUT",
      body: JSON.stringify({
        ...xs,
        id: data!.id,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          toast({ title: "Changes saved" });
        } else {
          console.error(res);
          toast({ title: "Unexpected error occured" });
        }
      })
      .finally(() => setIsSaving(false));
  };

  const m = useMutation({
    mutationFn: update,
    onSuccess() {
      client.invalidateQueries({ queryKey: ["client.settings"] });
    },
  });

  const resolverType = F.CompanySchema.merge(F.QuestionaireSchema);

  type FormSchema = Zod.infer<typeof resolverType>;

  const form = useForm<FormSchema>({
    resolver: zodResolver(resolverType),
    defaultValues: data,
    values: data,
  });

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((vals) => m.mutateAsync(vals))}
      >
        {/* <CompanyInputs form={form} /> */}
        <Typo.H2>I’m looking for developers for</Typo.H2>
        <RadioGroup control={form.control} path="projectFor">
          <ProjectsForRadioItems />
        </RadioGroup>
        <Typo.H2>Some other prompt</Typo.H2>
        <RadioGroup control={form.control} path="companySize">
          <CompanySizeRadioItems />
        </RadioGroup>
        <SubmitBtn isEnabled={true} />
      </form>
    </Form>
  );
}

export function FormData({
  children,
}: {
  // eslint-disable-next-line no-unused-vars
  children: (c: Customer) => React.ReactNode;
}) {
  const result = useQuery({
    queryKey: ["client.settings"],
    queryFn: getClientSettings,
  });

  return (
    <>
      {match(result)
        .with({ status: "loading" }, () => <Loader2 className="animate-spin" />)
        .with({ status: "error" }, () => (
          <E error={new Error("something went wrong")} reset={noop} />
        ))
        .with({ status: "success" }, ({ data }) => children(data))
        .exhaustive()}
    </>
  );
}

export function BF({ data }: { data: Customer }) {
  const client = useQueryClient();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const update = (xs: F.BuyerDetailsSchemaT) => {
    setIsSaving(true);

    return fetch("/api/client/register", {
      method: "PUT",
      body: JSON.stringify({
        ...xs,
        id: data!.id,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          toast({ title: "Changes saved" });
        } else {
          console.error(res);
          toast({ title: "Unexpected error occured" });
        }
      })
      .finally(() => setIsSaving(false));
  };

  const m = useMutation({
    mutationFn: update,
    onSuccess() {
      client.invalidateQueries({ queryKey: ["client.settings"] });
    },
  });

  const form = F.useBuyerForm({
    defaultValues: data,
    values: data,
  });

  const submittable =
    !isSaving && form.formState.isDirty && form.formState.isValid;

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((xs) => m.mutateAsync(xs))}
      >
        {/* <BuyerInputs form={form} /> */}
        <SubmitBtn isEnabled={submittable} />
      </form>
    </Form>
  );
}

export const CompanyForm = () => (
  <FormData>{(data) => <CF data={data} />}</FormData>
);

export const BuyerForm = () => (
  <FormData>{(data) => <BF data={data} />}</FormData>
);
