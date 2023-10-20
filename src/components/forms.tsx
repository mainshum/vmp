import {
  Control,
  ControllerProps,
  FieldPath,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import { Input } from "./ui/input";
import {
  RadioGroup as RG,
  RadioGroupItem as RGI,
  RadioGroupItem,
} from "./ui/radio-group";

import { match } from "ts-pattern";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  FormDescription,
} from "./ui/form";
import { Button } from "./ui/button";
import { HTMLInputTypeAttribute } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import React from "react";
import { CompanySize, ProjectFor } from "@prisma/client";

export interface InputProps<T>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  controlForm: UseFormReturn<any>;
  path: Path<T>;
  type?: HTMLInputTypeAttribute;
}

export function MySelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: {
  control: ControllerProps<TFieldValues, TName>["control"];
  name: ControllerProps<TFieldValues, TName>["name"];
  label: string;
  placeholder: string;
  children: React.ReactNode;
}) {
  const { control, name, children, label, placeholder } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>{children}</SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function MyInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: {
  control: ControllerProps<TFieldValues, TName>["control"];
  name: ControllerProps<TFieldValues, TName>["name"];
  label: string;
  placeholder: string;
  description?: string;
  disabled?: boolean;
}) {
  const {
    control,
    name,
    description,
    label,
    placeholder,
    disabled = false,
  } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input disabled={disabled} placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

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
    {Object.values(ProjectFor).map((el) => (
      <FormItem key={el} className="flex items-center space-x-3 space-y-0">
        <FormControl>
          <RGI value={el} />
        </FormControl>
        <FormLabel>
          {match(el)
            .with("INTERNAL", () => "My company (internal support)")
            .with(
              "EXTERNAL",
              () => "Project for a different company (re-sell of services)",
            )
            .exhaustive()}
        </FormLabel>
      </FormItem>
    ))}
  </>
);

export const CompanySizeRadioItems = () => (
  <>
    {Object.values(CompanySize).map((el) => (
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
