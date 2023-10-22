"use client";

import { RegisterForm } from "@/components/register";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ShoppingCart } from "lucide-react";
import React from "react";

export default function RoleSelect() {
  return (
    <section className="flex justify-center p-8">
      <Dialog>
        <DialogTrigger
          className={cn(
            buttonVariants({ variant: "subtle" }),
            "disabled flex h-[300px] w-[300px] flex-col gap-4",
          )}
        >
          <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl">
            Client
          </h1>
          <h2>Recipent of goods and services</h2>
          <ShoppingCart className="h-8 w-8" />
        </DialogTrigger>
        <DialogContent className="min-h-full overflow-y-auto sm:min-h-[75%]">
          <DialogHeader>
            <DialogTitle className="pb-4">Client registration</DialogTitle>
          </DialogHeader>
          <RegisterForm />
        </DialogContent>
      </Dialog>
    </section>
  );
}
