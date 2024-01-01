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
import { RouterOutputs, trpc } from "@/lib/trpc";
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
import { useRouter } from "next/navigation";

type Offer = RouterOutputs["VENDOR"]["offer"];

type Props = {
  requestId: string;
  offer?: Offer;
};

const handleFileUpload = (f: File) =>
  new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onloadend = (e) => res(e.target?.result as string);
    reader.onerror = () => rej();

    reader.readAsDataURL(f);
  });

export const JobProfileForm = ({ requestId, offer }: Props) => {
  const fileInput = React.useRef<HTMLInputElement>(null);

  const form = useForm<OfferInput>({
    resolver: zodResolver(OfferInput.omit({ cv: true })),
    defaultValues: {
      requestId: requestId,
      id: offer?.id || nanoid(),
      profile: offer?.profile || undefined,
      subProfile: offer?.subProfile || undefined,
      seniority: offer?.seniority || undefined,
      startDate: offer?.startDate || undefined,
      cv: "",
    },
  });

  const router = useRouter();

  const cbs = {
    onMutate: () => {
      toast({ title: "Submitting offer" });
    },
    onError: () => {
      toast({ title: "Error submitting form" });
    },
    onSuccess: () => {
      router.refresh();
      toast({ title: "Offer submitted" });
    },
  };

  const isEdit = !!offer;

  const { mutateAsync: insertOffer } = trpc.VENDOR.insertOffer.useMutation(cbs);
  const { mutateAsync: updateOffer } = trpc.VENDOR.updateOffer.useMutation(cbs);

  const { toast } = useToast();

  // eslint-disable-next-line no-unused-vars
  const handleSubmit = form.handleSubmit(
    async ({ cv, ...rest }): Promise<unknown> => {
      const file = fileInput.current?.files?.[0];

      if (isEdit) {
        if (!file) return updateOffer(rest);

        const data = await handleFileUpload(file);

        return updateOffer({ ...rest, cv: data });
      }

      if (!file) {
        toast({ title: "Please select a CV to upload" });
        return Promise.reject();
      }

      const data = await handleFileUpload(file);

      return insertOffer({ ...rest, cv: data });
    },
  );

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
        <SubmitButton disabled={form.formState.isSubmitting}>
          Submit offer
        </SubmitButton>
      </FormWrapper>
    </Form>
  );
};
