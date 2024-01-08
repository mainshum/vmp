import { Nullalble } from "@/types/shared";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export const createDate = (val: Nullalble<Date>) => {
  if (val) return val.toDateString();

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
