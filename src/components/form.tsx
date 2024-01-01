"use client";

import React, { ButtonHTMLAttributes } from "react";
import { Button } from "./ui/button";

export const FormWrapper = React.forwardRef<
  HTMLFormElement,
  React.HTMLAttributes<HTMLFormElement>
>(({ children, ...props }, ref) => {
  return (
    <form
      noValidate
      {...props}
      ref={ref}
      className="relative top-16 flex flex-col items-center space-y-8 pb-8 [&>*]:w-[50%]"
    >
      {children}
    </form>
  );
});

export const SubmitButton = React.forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ children }, ref) => {
  return (
    <section className="flex justify-center">
      <Button ref={ref} type="submit">
        {children}
      </Button>
    </section>
  );
});

SubmitButton.displayName = "SubmitButton";
FormWrapper.displayName = "FormWrapper";
