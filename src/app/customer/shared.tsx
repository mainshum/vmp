"use client";

import { HelpCircle } from "lucide-react";
import React from "react";
import { Nullalble } from "@/types/shared";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const createDate = (val: Nullalble<Date>) => {
  if (val) return val.getTime();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpCircle className="h-4 w-4 cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent>
          Not available until the opportunity/offer is approved
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
