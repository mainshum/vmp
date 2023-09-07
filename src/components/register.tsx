"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/Button";
import { useForm, UseFormReturn } from "react-hook-form";
import { Input } from "./ui/input";
import * as Typo from "./typography";
import React, { useState } from "react";
import { Noop } from "@/types/shared";
import { ZodType } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CompanySizeSchema,
  CustomerSchema,
  ProjectForSchema,
} from "../../prisma/generated/zod";

type FormPage = 0 | 1 | 2;

function withTransitionIfExists(fn: CallableFunction) {
  if (!document.startViewTransition) {
    fn();
    return;
  }

  document.startViewTransition(fn);
}

const CompanySchema = CustomerSchema.pick({
  companyName: true,
  addressLine1: true,
  addressLine2: true,
  postalCode: true,
  city: true,
  taxId: true,
  ndaPerson: true,
});

const BuyerDetailsSchema = CustomerSchema.pick({
  name: true,
  surname: true,
  mail: true,
  phone: true,
  position: true,
});

const QuestionaireSchema = CustomerSchema.pick({
  companySize: true,
  projectFor: true,
});

type CompanySchemaT = z.infer<typeof CompanySchema>;
type BuyerDetailsSchemaT = z.infer<typeof BuyerDetailsSchema>;
type QuestionaireSchemaT = z.infer<typeof QuestionaireSchema>;

export function RegisterForm() {
  const [page, setPage] = useState<FormPage>(0);

  let companyDetailsDefault: CompanySchemaT = {
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    companyName: "",
    ndaPerson: "",
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

  const questionaireForm = useForm<QuestionaireSchemaT>({
    resolver: zodResolver(QuestionaireSchema),
    defaultValues: {
      companySize: "BELOW10",
      projectFor: "INTERNAL",
    },
  });

  const hopPage = (no: FormPage) => withTransitionIfExists(() => setPage(no));

  const onCompanyDetailsSubmit = () => hopPage(1);

  const onBuyerReprSubmit = () => hopPage(2);

  const onQuestionaireSubmit = async () => {
    const res = await fetch("/api/client/register", {
      method: "POST",
      body: JSON.stringify({
        ...companyForm.getValues(),
        ...buyerForm.getValues(),
        ...questionaireForm.getValues(),
      }),
    });

    //const json = await res.json();
  };

  return (
    <React.Fragment>
      {page === 0 && (
        <CompanyDetails form={companyForm} onSubmit={onCompanyDetailsSubmit} />
      )}
      {page === 1 && (
        <BuyerRepr
          form={buyerForm}
          onPrevClick={() => withTransitionIfExists(() => setPage(0))}
          onSubmit={onBuyerReprSubmit}
        />
      )}
      {page === 2 && (
        <Questionaire
          form={questionaireForm}
          onPrevClick={() => withTransitionIfExists(() => setPage(1))}
          onSubmit={onQuestionaireSubmit}
        />
      )}
    </React.Fragment>
  );
}

type SharedProps<T extends ZodType<any, any, any>> = {
  // eslint-disable-next-line no-unused-vars
  onSubmit: (_vals: z.infer<T>) => void;
  form: UseFormReturn<z.infer<T>>;
};

function Questionaire({
  form,
  onPrevClick,
  onSubmit,
}: { onPrevClick: Noop } & SharedProps<typeof QuestionaireSchema>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <Typo.H1>More information</Typo.H1>
        <FormField
          control={form.control}
          name="projectFor"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <Typo.H2>I’m looking for developers for</Typo.H2>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {ProjectForSchema.options.map((opt) => (
                    <FormItem
                      key={opt}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={opt} />
                      </FormControl>
                      <FormLabel>{opt}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="companySize"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <Typo.H2>My company employs</Typo.H2>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {CompanySizeSchema.options.map((el) => (
                    <FormItem
                      key={el}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={el} />
                      </FormControl>
                      <FormLabel>{el}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <BtnsControls
          onPrevClick={onPrevClick}
          submitBtnText="Finish registration"
        />
      </form>
    </Form>
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

function BuyerRepr({
  onSubmit,
  form,
  onPrevClick,
}: {
  onPrevClick: Noop;
} & SharedProps<typeof BuyerDetailsSchema>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Typo.H1>Buyer representative</Typo.H1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="surname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Surname</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Position</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <BtnsControls onPrevClick={onPrevClick} />
      </form>
    </Form>
  );
}

function CompanyDetails({ form, onSubmit }: SharedProps<typeof CompanySchema>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Typo.H1>Company details</Typo.H1>
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address line 1</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address line 2</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="taxId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ndaPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name and position of the person to sign NDA</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}
