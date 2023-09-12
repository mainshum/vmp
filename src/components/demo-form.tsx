"use client";
import { createMachine } from "xstate";
import type { Customer } from "@prisma/client";
import * as F from "@/components/register";
import { Form } from "@/components/ui/form";
import React from "react";
import { Button } from "./ui/Button";

type FormData = {
  name: string;
};

const formMachine = createMachine<FormData>({
  id: "formMachine",
  context: { name: "" },
});

function DemoForm({ data }: { data: Customer }) {
  const cf = F.useCompanyForm(data);

  const updateCompanyDetails = console.log;

  cf.handleSubmit();

  return (
    <React.Fragment>
      <Form {...cf}>
        <F.CompanyDetails form={cf} onSubmit={updateCompanyDetails} />;
        <div className="flex justify-center">
          <Button type="submit">Next</Button>
        </div>
      </Form>
      <Form {...cf}>
        <F.CompanyDetails form={cf} onSubmit={updateCompanyDetails} />;
      </Form>
    </React.Fragment>
  );
}
export default DemoForm;
