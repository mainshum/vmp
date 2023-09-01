"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const minToCharsString = z.string().min(2, {
  message: "At least 2 characters.",
});

const companyDetails = z.object({
  companyName: minToCharsString,
  address: minToCharsString,
  taxId: minToCharsString,
  ndaPerson: minToCharsString,
});

const buyerRepr = z.object({
  name: minToCharsString,
  //   surname: minToCharsString,
  //   position: minToCharsString,
  //   mail: minToCharsString,
  //   phone: minToCharsString,
});

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/Button";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { H1 } from "./typography";
import React, { useState } from "react";

type Page = 0 | 1;

export function RegisterForm() {
  const [page, setPage] = useState<Page>(0);

  function onCompanyDetailsSubmit(values: z.infer<typeof companyDetails>) {
    setPage(1);
  }

  function onBuyerReprSubmit(values: z.infer<typeof buyerRepr>) {
    setPage(0);
  }

  return (
    <React.Fragment>
      {page === 0 && <CompanyDetails onSubmit={onCompanyDetailsSubmit} />}
      {page === 1 && <BuyerRepr onSubmit={onBuyerReprSubmit} />}
    </React.Fragment>
  );
}

function BuyerRepr({
  onSubmit,
}: {
  onSubmit: (vals: z.infer<typeof buyerRepr>) => void;
}) {
  const form = useForm<z.infer<typeof buyerRepr>>({
    resolver: zodResolver(buyerRepr),
    defaultValues: {},
  });

  console.log(form.formState.isValid);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <H1>Buyer representative</H1>
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
        <Button type="submit">Prev</Button>
      </form>
    </Form>
  );
}

function CompanyDetails({
  onSubmit,
}: {
  onSubmit: (vals: z.infer<typeof companyDetails>) => void;
}) {
  const form = useForm<z.infer<typeof companyDetails>>({
    resolver: zodResolver(companyDetails),
    defaultValues: {},
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <H1>Company details</H1>
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
        <Button type="submit">Next</Button>
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
