"use client";
import type { Customer } from "@prisma/client";
import * as F from "@/components/register";
import { Form } from "@/components/ui/form";
import React from "react";
import { Button } from "@/components/ui/Button";
import { noop } from "@/lib/utils";

export function CompanyForm({ data }: { data: Customer }) {
  const cf = F.useCompanyForm(data);

  const updateCompanyDetails = console.log;

  return (
    <Form {...cf}>
      <F.CompanyDetails form={cf} />;
      <div className="flex justify-center">
        <Button type="submit">Next</Button>
      </div>
    </Form>
  );
}

export function BuyerForm({ data }: { data: Customer }) {
  const form = F.useBuyerForm(data);

  const updateBuyer = console.log;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(updateBuyer)}>
        <F.BuyerRepr form={form} onPrevClick={noop} />;
        <div className="flex justify-center">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
