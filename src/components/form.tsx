"use client";

import React from "react";

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

FormWrapper.displayName = "FormWrapper";
