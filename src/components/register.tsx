"use client";

import ErrorComp from "@/app/register/error";
import { match } from "ts-pattern";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import * as Typo from "./typography";
import React, { useState } from "react";
import { CustomerModel } from "../../prisma/zod";
import { Dialog, DialogContent } from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/lib/const";
import { noop, withTransitionIfExists } from "@/lib/utils";
import { MyInput, MySelect } from "./forms";
import { useMutation } from "@tanstack/react-query";
import { SelectItem } from "./ui/select";
import { CompanySize, ProjectFor } from "@prisma/client";

type FormStep = "company" | "buyer" | "submitting" | "error_submitting";

export const CompanySchema = CustomerModel.pick({
  companyName: true,
  companySize: true,
  projectFor: true,
  addressLine1: true,
  addressLine2: true,
  postalCode: true,
  city: true,
  taxId: true,
});

export const BuyerDetailsSchema = CustomerModel.pick({
  name: true,
  surname: true,
  mail: true,
  phone: true,
  position: true,
});

export type CompanySchemaT = z.infer<typeof CompanySchema>;
export type BuyerDetailsSchemaT = z.infer<typeof BuyerDetailsSchema>;

function SavingModal({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="flex items-center justify-between">
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function RegisterForm() {
  const [formStep, setPage] = useState<FormStep>("company");

  const session = useSession();
  const router = useRouter();

  const sp = useSearchParams();

  let companyDetailsDefault: CompanySchemaT = {
    companySize: "FROM50TO250",
    projectFor: "INTERNAL",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    companyName: "",
    taxId: "",
  };
  let buyerReprDefault: BuyerDetailsSchemaT = {
    mail: "",
    name: "",
    phone: "",
    position: "",
    surname: "",
  };

  if (typeof window !== "undefined" && window.Cypress) {
    if (window.Cypress.mockCompanyDetails) {
      companyDetailsDefault = window.Cypress.mockCompanyDetails;
    }

    if (window.Cypress.mockBuyerDetails) {
      buyerReprDefault = window.Cypress.mockBuyerDetails;
    }
  }

  const companyForm = useForm<CompanySchemaT>({
    resolver: zodResolver(CompanySchema),
    defaultValues: companyDetailsDefault,
  });

  const buyerForm = useForm<BuyerDetailsSchemaT>({
    resolver: zodResolver(BuyerDetailsSchema),
    defaultValues: buyerReprDefault,
  });

  const registerCustomer = () => {
    setPage("submitting");
    return fetch(ROUTES.API.CLIENT_REGISTER, {
      method: "POST",
      body: JSON.stringify({
        id: session.data?.user.id,
        ...companyForm.getValues(),
        ...buyerForm.getValues(),
      }),
    })
      .then((res) => res.json())
      .then((data) => data.id);
  };

  const { mutate } = useMutation({
    mutationFn: registerCustomer,
    onSuccess: () => router.push(ROUTES.SUCCESS("customer_registered")),
  });

  const hopPage = (no: FormStep) => setPage(no);

  return (
    <React.Fragment>
      {match(formStep)
        .with("company", () => (
          <Form key="companyForm" {...companyForm}>
            <form
              noValidate
              className="space-y-6"
              onSubmit={companyForm.handleSubmit(() => hopPage("buyer"))}
            >
              <MyInput
                control={companyForm.control}
                name="companyName"
                label="Company name"
                placeholder="Insert company name"
              />
              <MySelect
                control={companyForm.control}
                name="companySize"
                label="Company size"
                placeholder="Insert company size"
              >
                {Object.keys(CompanySize).map((key) => (
                  <SelectItem key={key} value={key}>
                    {CompanySize[key as keyof typeof CompanySize]}
                  </SelectItem>
                ))}
              </MySelect>
              <MySelect
                control={companyForm.control}
                name="projectFor"
                label="Project for"
                placeholder="Internal or external project?"
              >
                {Object.keys(ProjectFor).map((key) => (
                  <SelectItem key={key} value={key}>
                    {ProjectFor[key as keyof typeof ProjectFor]}
                  </SelectItem>
                ))}
              </MySelect>
              <MyInput
                control={companyForm.control}
                name="addressLine1"
                label="Address line 1"
                placeholder="Input first addres line"
              />
              <MyInput
                control={companyForm.control}
                name="addressLine2"
                label="Address line 2"
                placeholder="Input second addres line"
              />
              <MyInput
                control={companyForm.control}
                name="postalCode"
                label="Postal code"
                placeholder="Input postal code"
              />

              <MyInput
                control={companyForm.control}
                name="city"
                label="City"
                placeholder="Input city"
              />
              <MyInput
                control={companyForm.control}
                name="taxId"
                label="Tax ID"
                placeholder="Input tax ID"
              />
              <div className="flex justify-center">
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        ))
        .with("buyer", () => (
          <Form key="buyerForm" {...buyerForm}>
            <form
              noValidate
              className="space-y-8"
              onSubmit={buyerForm.handleSubmit(() => mutate())}
            >
              <Typo.H1>Buyer representative</Typo.H1>
              <MyInput
                control={buyerForm.control}
                name="name"
                label="Name"
                placeholder="Input name"
              />
              <MyInput
                control={buyerForm.control}
                name="surname"
                label="Surname"
                placeholder="Input surname"
              />
              <MyInput
                control={buyerForm.control}
                name="mail"
                label="Mail"
                placeholder="Input email"
              />
              <MyInput
                control={buyerForm.control}
                name="phone"
                label="Phone"
                placeholder="Input phone number"
              />
              <MyInput
                disabled={buyerForm.formState.isSubmitting}
                control={buyerForm.control}
                name="position"
                label="Position"
                placeholder="Input position"
              />
              <div className="flex justify-center">
                <Button
                  onClick={() =>
                    withTransitionIfExists(() => setPage("company"))
                  }
                >
                  Company information
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        ))
        .with("submitting", () => (
          <SavingModal isOpen={true}>
            <Typo.H2>Saving the user</Typo.H2>
            <Loader2 className="animate-spin"></Loader2>
          </SavingModal>
        ))
        .with("error_submitting", () => (
          <ErrorComp
            reset={noop}
            error={
              new Error("Unexpected error occured when submitting the form")
            }
          />
        ))
        .exhaustive()}
    </React.Fragment>
  );
}
