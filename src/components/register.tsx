"use client";

import ErrorComp from "@/app/register/error";
import { match } from "ts-pattern";
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
import { useForm, UseFormProps, UseFormReturn } from "react-hook-form";
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
import { Dialog, DialogContent } from "./ui/dialog";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ROUTES } from "@/lib/const";
import { noop, withTransitionIfExists } from "@/lib/utils";

type FormStep = 0 | 1 | 2 | "submitting" | "error_submitting";

const CompanySchema = CustomerSchema.pick({
  companyName: true,
  addressLine1: true,
  addressLine2: true,
  postalCode: true,
  city: true,
  taxId: true,
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

export type CompanySchemaT = z.infer<typeof CompanySchema>;
export type BuyerDetailsSchemaT = z.infer<typeof BuyerDetailsSchema>;
type QuestionaireSchemaT = z.infer<typeof QuestionaireSchema>;

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

export function useCompanyForm(xs: Pick<UseFormProps<CompanySchemaT>, 'defaultValues' | 'values'>) {
  return useForm<CompanySchemaT>({
    resolver: zodResolver(CompanySchema),
    ...xs
  });
}

export function useBuyerForm(defaultVals?: BuyerDetailsSchemaT) {
  return useForm<BuyerDetailsSchemaT>({
    resolver: zodResolver(BuyerDetailsSchema),
    defaultValues: defaultVals,
  });
}

export function RegisterForm() {
  const [formStep, setPage] = useState<FormStep>(0);

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
    defaultValues: companyDetailsDefault
  });
  const buyerForm = useBuyerForm(buyerReprDefault);

  const questionaireForm = useForm<QuestionaireSchemaT>({
    resolver: zodResolver(QuestionaireSchema),
    defaultValues: {
      companySize: "BELOW10",
      projectFor: "INTERNAL",
    },
  });

  const hopPage = (no: FormStep) => withTransitionIfExists(() => setPage(no));

  const onCompanyDetailsSubmit = () => {
    hopPage(1);
  };

  const onBuyerReprSubmit = () => hopPage(2);

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

  return (
    <React.Fragment>
      {match(formStep)
        .with(0, () => (
          <Form {...companyForm}>
            <form onSubmit={companyForm.handleSubmit(onCompanyDetailsSubmit)}>
              <CompanyDetails form={companyForm} />

              <div className="flex justify-center">
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        ))
        .with(1, () => (
          <Form {...buyerForm}>
            <form
              className="space-y-8"
              onSubmit={buyerForm.handleSubmit(onBuyerReprSubmit)}
            >
              <BuyerRepr form={buyerForm} />
              <div className="flex justify-center">
                <Button
                  onClick={() => withTransitionIfExists(() => setPage(0))}
                >
                  Previous
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        ))
        .with(2, () => (
          <Form {...questionaireForm}>
            <form
              className="space-y-12"
              onSubmit={questionaireForm.handleSubmit(onQuestionaireSubmit)}
            >
              <Questionaire
                form={questionaireForm}
                onPrevClick={() => withTransitionIfExists(() => setPage(1))}
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

function Questionaire({
  form,
  onPrevClick,
}: { onPrevClick: Noop } & SharedProps<typeof QuestionaireSchema>) {
  return (
    <>
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
                    <FormLabel>
                      {match(opt)
                        .with("INTERNAL", () => "My company (internal support)")
                        .with(
                          "EXTERNAL",
                          () =>
                            "project for a different company (re-sell of services)",
                        )
                        .exhaustive()}
                    </FormLabel>
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
                    <FormLabel>
                      {match(el)
                        .with("BELOW10", () => "Less than 10")
                        .with("FROM11TO50", () => "11-50")
                        .with("FROM50TO250", () => "50-250")
                        .with("FROM250TO1000", () => "250-1000")
                        .with("ABOVE1000", () => "1000+")
                        .exhaustive()}
                    </FormLabel>
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

export function BuyerRepr({ form }: SharedProps<typeof BuyerDetailsSchema>) {
  return (
    <>
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
    </>
  );
}

export function CompanyDetails({ form }: SharedProps<typeof CompanySchema>) {
  return (
    <>
      <Typo.H1>Company Information</Typo.H1>
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-extrabold">Company name</FormLabel>
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
            <FormLabel className="font-extrabold">Tax ID</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Typo.H2>Address</Typo.H2>
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
            <FormLabel>Postal code</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
