"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";
import { OfferInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { MySelect } from "@/components/forms";
import { JobProfile, Seniority } from "@prisma/client";
import { SelectItem } from "@/components/ui/select";
import { cn, getSubProfile } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { FormWrapper } from "@/components/form";

type Props = {
  requestName: string;
};

export const JobProfileForm = ({ requestName }: Props) => {
  const form = useForm<OfferInput>({
    resolver: zodResolver(OfferInput),
    defaultValues: {
      profile: undefined,
      subProfile: undefined,
      seniority: undefined,
      startDate: undefined,
    },
  });

  const router = useRouter();

  const subProfile = getSubProfile(form.watch("profile"));

  return (
    <Form {...form}>
      <FormWrapper onSubmit={console.log}>
        <MySelect
          control={form.control}
          name="profile"
          placeholder="Select profile"
          label="Consultant's profile"
        >
          {Object.values(JobProfile).map((val) => (
            <SelectItem key={val} value={val}>
              {val}
            </SelectItem>
          ))}
        </MySelect>
        <MySelect
          control={form.control}
          name="subProfile"
          placeholder="Select sub-profile"
          label="Consultant's sub-profile"
        >
          {Object.values(subProfile).map((val) => (
            <SelectItem key={val} value={val}>
              {val}
            </SelectItem>
          ))}
        </MySelect>
        <MySelect
          control={form.control}
          name="seniority"
          placeholder="Select seniority"
          label="Consultant's seniority"
        >
          {Object.values(Seniority).map((val) => (
            <SelectItem key={val} value={val}>
              {val}
            </SelectItem>
          ))}
        </MySelect>
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Consultant available from</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    onSelect={field.onChange}
                    disabled={(date) => date <= new Date()}
                    initialFocus
                    {...(field.value ? { selected: field.value } : {})}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </FormWrapper>
    </Form>
  );
};
