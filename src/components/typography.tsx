import { cn } from "@/lib/utils";
import React from "react";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const H1 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, ...props }, ref) => (
    <h1
      ref={ref}
      className={cn(
        "text-2xl font-extrabold tracking-tight lg:text-4xl",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  ),
);

export const H2 = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-xl font-extrabold tracking-tight lg:text-2xl",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  ),
);

H1.displayName = "H1";
H2.displayName = "H2";
