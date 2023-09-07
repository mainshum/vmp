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
  companyDetails,
  buyerRepr,
  questionaire,
  devProjectType,
  companyType,
  companySize,
} from "@/types/data";

type Page = 0 | 1 | 2;

function withTransitionIfExists(fn: CallableFunction) {
  if (!document.startViewTransition) {
    fn();
    return;
  }

  document.startViewTransition(fn);
}
export type CompanyDetails = z.infer<typeof companyDetails>;
export type BuyerDetails = z.infer<typeof buyerRepr>;

export function RegisterForm() {
  const [page, setPage] = useState<Page>(0);

  let companyDetailsDefault: CompanyDetails = {
    companyName: "",
    address: "",
    ndaPerson: "",
    taxId: "",
  };
  let buyerReprDefault: BuyerDetails = {
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

  const companyForm = useForm<CompanyDetails>({
    resolver: zodResolver(companyDetails),
    defaultValues: companyDetailsDefault,
  });

  const buyerForm = useForm<BuyerDetails>({
    resolver: zodResolver(buyerRepr),
    defaultValues: buyerReprDefault,
  });

  const questionaireForm = useForm<z.infer<typeof questionaire>>({
    resolver: zodResolver(questionaire),
    defaultValues: {
      devProjectType: devProjectType[0],
      companyType: companyType[0],
      companySize: companySize[0],
    },
  });

  function onCompanyDetailsSubmit() {
    withTransitionIfExists(() => setPage(1));
  }

  function onBuyerReprSubmit() {
    withTransitionIfExists(() => setPage(2));
  }

  function onQuestionaireSubmit() {
    console.log(buyerForm.getValues());
    console.log(companyForm.getValues());
    alert("Registartion finished.");
  }

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
}: { onPrevClick: Noop } & SharedProps<typeof questionaire>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
        <FormField
          control={form.control}
          name="devProjectType"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <Typo.H2>How mature is the project?</Typo.H2>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {devProjectType.map((el) => (
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
        />{" "}
        <FormField
          control={form.control}
          name="companyType"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <Typo.H2>Who is the project for?</Typo.H2>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {companyType.map((el) => (
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
        <FormField
          control={form.control}
          name="companySize"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <Typo.H2>How big is the company?</Typo.H2>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {companySize.map((el) => (
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
} & SharedProps<typeof buyerRepr>) {
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

function CompanyDetails({
  form,
  onSubmit,
}: SharedProps<typeof companyDetails>) {
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
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

// import { useForm, SubmitHandler } from "react-hook-form";

// type Inputs = {
//   example: string;
//   exampleRequired: string;
// };

// export function Form() {
//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<Inputs>();
//   const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

//   console.log(watch("example")); // watch input value by passing the name of it

//   return (
//     /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
//     <form onSubmit={handleSubmit(onSubmit)}>
//       {/* register your input into the hook by invoking the "register" function */}
//       <input defaultValue="test" {...register("example")} />

//       {/* include validation with required or other standard HTML validation rules */}
//       <input {...register("exampleRequired", { required: true })} />
//       {/* errors will return when field validation fails  */}
//       {errors.exampleRequired && <span>This field is required</span>}

//       <input type="submit" />
//     </form>
//   );
// }
