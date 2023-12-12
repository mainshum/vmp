import { cn } from "@/lib/utils";
import React from "react";

const SideNav = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "hidden h-full flex-col items-center bg-slate-50 px-20 lg:flex",
        className,
      )}
    >
      {props.children}
    </div>
  );
});

SideNav.displayName = "SideNav";

export default SideNav;
