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
import { useToast } from "@/hooks/use-toast";
import { trpc } from "@/lib/trpc";
import { OfferInput } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { FormWrapper, SubmitButton } from "@/components/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { nanoid } from "nanoid";

type Props = {
  requestName: string;
  requestId: string;
};

export const JobProfileForm = ({ requestName, requestId }: Props) => {
  const fileInput = React.useRef<HTMLInputElement>(null);

  const form = useForm<OfferInput>({
    resolver: zodResolver(OfferInput),
    defaultValues: {
      id: nanoid(),
      requestId: requestId,
      profile: undefined,
      subProfile: undefined,
      seniority: undefined,
      startDate: undefined,
      cv: "",
    },
  });

  const { mutate, isLoading } = trpc.VENDOR.upsertOffer.useMutation({
    onMutate: () => {
      toast({ title: "Submitting offer" });
    },
    onError: () => {
      toast({ title: "Error submitting form" });
    },
    onSuccess: () => {
      toast({ title: "Offer submitted" });
    },
  });

  const { toast } = useToast();

  const handleSubmit = form.handleSubmit(({ cv, ...rest }) => {
    const file = fileInput.current?.files?.[0];
    if (!file) {
      toast({ title: "Please upload a CV" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (e) =>
      mutate({
        ...rest,
        cv: e.target?.result as string,
      });

    reader.onerror = (e) => {
      toast({ title: "Error uploading CV" });
      reader.abort();
    };

    reader.readAsDataURL(file);
  });

  const subProfile = getSubProfile(form.watch("profile"));

  return (
    <Form {...form}>
      <FormWrapper onSubmit={handleSubmit}>
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
                <PopoverContent className="w-auto p-0" align="end">
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
        <FormField
          control={form.control}
          name="cv"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CV</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  ref={fileInput}
                  type="file"
                  value={field.value}
                />
              </FormControl>
              <FormDescription>
                Remember that the cv you include should be{" "}
                <a
                  className="underline"
                  target="_blank"
                  rel="noopener norefferer"
                  href="https://occy.com/blog/blind-cvs/"
                >
                  blind.
                </a>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton disabled={isLoading}>Submit offer</SubmitButton>
      </FormWrapper>
    </Form>
  );
};
