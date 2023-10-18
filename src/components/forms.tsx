import { Control, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { isCompanyKey } from "@/lib/utils";
import { Input } from "./ui/input";
import {
  RadioGroup as RG,
  RadioGroupItem as RGI,
  RadioGroupItem,
} from "./ui/radio-group";
import {
  CompanySizeSchema,
  Customer,
  ProjectForSchema,
} from "../../prisma/generated/zod";
import { match } from "ts-pattern";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { BuyerDetailsSchemaT, CompanySchema } from "./register";
import { HTMLInputTypeAttribute } from "react";

export interface InputProps<T>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  controlForm: UseFormReturn<any>;
  path: Path<T>;
  type?: HTMLInputTypeAttribute;
}

export function FormInput<T>({
  controlForm,
  path,
  label,
  type = "text",
}: InputProps<T>) {
  return (
    <FormField
      control={controlForm.control}
      name={path}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function CompanyInputs({ form }: { form: UseFormReturn<any> }) {
  const vals = CompanySchema.keyof().Values;
  return (
    <>
      {Object.keys(vals).map((key) =>
        isCompanyKey(key) ? (
          <FormInput
            disabled={form.formState.isSubmitting}
            key={key}
            controlForm={form}
            path={key}
            label={customerLabels[key]}
          />
        ) : null,
      )}
    </>
  );
}

export const BuyerInputs = ({ form }: { form: UseFormReturn<any> }) => (
  <>
    <FormInput<BuyerDetailsSchemaT>
      disabled={form.formState.isSubmitting}
      controlForm={form}
      path="name"
      label={customerLabels.name}
    />
    <FormInput<BuyerDetailsSchemaT>
      disabled={form.formState.isSubmitting}
      controlForm={form}
      path="surname"
      label={customerLabels.surname}
    />
    <FormInput<BuyerDetailsSchemaT>
      disabled={form.formState.isSubmitting}
      controlForm={form}
      path="mail"
      type="email"
      label={customerLabels.mail}
    />
    <FormInput<BuyerDetailsSchemaT>
      disabled={form.formState.isSubmitting}
      controlForm={form}
      path="phone"
      label={customerLabels.name}
    />
    <FormInput<BuyerDetailsSchemaT>
      disabled={form.formState.isSubmitting}
      controlForm={form}
      path="position"
      label={customerLabels.position}
    />
  </>
);

export function RadioGroup<T extends FieldValues>({
  control,
  children,
  path,
}: {
  control: Control<T>;
  children: React.ReactNode;
  path: Path<T>;
}) {
  return (
    <FormField
      control={control}
      name={path}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <FormControl>
            <RG
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {children}
            </RG>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const ProjectsForRadioItems = () => (
  <>
    {ProjectForSchema.options.map((opt) => (
      <FormItem key={opt} className="flex items-center space-x-3 space-y-0">
        <FormControl>
          <RGI value={opt} />
        </FormControl>
        <FormLabel>
          {match(opt)
            .with("INTERNAL", () => "My company (internal support)")
            .with(
              "EXTERNAL",
              () => "project for a different company (re-sell of services)",
            )
            .exhaustive()}
        </FormLabel>
      </FormItem>
    ))}
  </>
);

export const CompanySizeRadioItems = () => (
  <>
    {CompanySizeSchema.options.map((el) => (
      <FormItem key={el} className="flex items-center space-x-3 space-y-0">
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
  </>
);

export function SubmitBtn({ isEnabled = true }: { isEnabled?: boolean }) {
  return (
    <div className="flex justify-center">
      <Button disabled={!isEnabled} type="submit">
        Save changes
      </Button>
    </div>
  );
}

export const customerLabels: Record<keyof Customer, string> = {
  mail: "E-mail",
  name: "Name",
  phone: "Phone number",
  position: "Position",
  surname: "Surname",
  companyName: "Company name",
  addressLine1: "Address line 1",
  addressLine2: "Address line 2",
  city: "City",
  postalCode: "Postal code",
  taxId: "Tax ID",
  companySize: "Company size",
  id: "ID",
  projectFor: "Project for",
};
