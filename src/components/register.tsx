"use client";

import ErrorComp from "@/app/register/error";
import { match } from "ts-pattern";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "./ui/button";
import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
import * as Typo from "./typography";
import React, { useState } from "react";
import { Noop } from "@/types/shared";
import { ZodType } from "zod";
import { CustomerModel } from "../../prisma/zod";
import { Dialog, DialogContent } from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/lib/const";
import { noop, withTransitionIfExists } from "@/lib/utils";
import {
  CompanySizeRadioItems,
  MyInput,
  ProjectsForRadioItems,
  RadioGroup,
} from "./forms";

type FormStep =
  | "company"
  | "buyer"
  | "question"
  | "submitting"
  | "error_submitting";

export const CompanySchema = CustomerModel.pick({
  companyName: true,
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

export const QuestionaireSchema = CustomerModel.pick({
  companySize: true,
  projectFor: true,
});

export type CompanySchemaT = z.infer<typeof CompanySchema>;
export type BuyerDetailsSchemaT = z.infer<typeof BuyerDetailsSchema>;
export type QuestionaireSchemaT = z.infer<typeof QuestionaireSchema>;

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

export function useCompanyForm(
  xs: Pick<UseFormProps<CompanySchemaT>, "defaultValues" | "values">,
) {
  return useForm<CompanySchemaT>({
    ...xs,
    resolver: zodResolver(CompanySchema),
  });
}

export function useBuyerForm(
  xs: Pick<UseFormProps<BuyerDetailsSchemaT>, "defaultValues" | "values">,
) {
  return useForm<BuyerDetailsSchemaT>({
    ...xs,
    resolver: zodResolver(BuyerDetailsSchema),
  });
}

export function RegisterForm() {
  const [formStep, setPage] = useState<FormStep>("company");

  const session = useSession();
  const router = useRouter();

  let companyDetailsDefault: CompanySchemaT = {
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

  const companyForm = useCompanyForm({
    defaultValues: companyDetailsDefault,
  });

  const buyerForm = useForm<BuyerDetailsSchemaT>({
    resolver: zodResolver(BuyerDetailsSchema),
    defaultValues: buyerReprDefault,
  });

  const questionaireForm = useForm<QuestionaireSchemaT>({
    resolver: zodResolver(QuestionaireSchema),
    defaultValues: {
      companySize: "BELOW10",
      projectFor: "INTERNAL",
    },
  });

  const hopPage = (no: FormStep) => setPage(no);

  const onQuestionaireSubmit = async () => {
    setPage("submitting");

    try {
      const res = await fetch(ROUTES.API.CLIENT_REGISTER, {
        method: "POST",
        body: JSON.stringify({
          id: session.data?.user.id,
          ...companyForm.getValues(),
          ...buyerForm.getValues(),
          ...questionaireForm.getValues(),
        }),
      });

      const json = await res.json();

      if (!res.ok) throw Error(json?.errors);
    } catch (err) {
      setPage("error_submitting");
      return;
    }

    router.push(ROUTES.SUCCESS("customer_registered"));
  };

  console.log(buyerForm.watch());

  return (
    <React.Fragment>
      {match(formStep)
        .with("company", () => (
          <Form {...companyForm}>
            <form
              noValidate
              className="space-y-6"
              onSubmit={companyForm.handleSubmit(() => hopPage("buyer"))}
            >
              <Typo.H1>Company Information</Typo.H1>
              <MyInput
                control={companyForm.control}
                name="companyName"
                label="Company name"
                placeholder="Insert company name"
              />
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
          <Form {...buyerForm}>
            <form
              noValidate
              className="space-y-8"
              onSubmit={buyerForm.handleSubmit(() => hopPage("question"))}
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
        .with("question", () => (
          <Form {...questionaireForm}>
            <form
              className="space-y-12"
              onSubmit={questionaireForm.handleSubmit(onQuestionaireSubmit)}
            >
              <Questionaire
                form={questionaireForm}
                onPrevClick={() =>
                  withTransitionIfExists(() => setPage("buyer"))
                }
              />
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

type SharedProps<T extends ZodType<any, any, any>> = {
  form: UseFormReturn<z.infer<T>>;
};

export function Questionaire({
  form,
  onPrevClick,
}: { onPrevClick: Noop } & SharedProps<typeof QuestionaireSchema>) {
  return (
    <>
      <Typo.H1>More information</Typo.H1>
      <Typo.H2>I’m looking for developers for</Typo.H2>
      <RadioGroup control={form.control} path="projectFor">
        <ProjectsForRadioItems />
      </RadioGroup>
      <Typo.H2>Some other prompt</Typo.H2>
      <RadioGroup control={form.control} path="companySize">
        <CompanySizeRadioItems />
      </RadioGroup>
      <BtnsControls
        onPrevClick={onPrevClick}
        submitBtnText="Finish registration"
      />
    </>
  );
}

function BtnsControls({
  onPrevClick,
  submitBtnText = "Next",
}: {
  onPrevClick: Noop;
  submitBtnText?: string;
}) {
  return (
    <div className="flex justify-around">
      <Button variant="subtle" type="button" onClick={onPrevClick}>
        Prev
      </Button>
      <Button type="submit">{submitBtnText}</Button>
    </div>
  );
}
