"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  FieldValues,
  Path,
  UseFormProps,
  UseFormReturn,
  useForm,
  useFormState,
} from "react-hook-form";
import { SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths, addDays, addWeeks } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMemo, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  ProjectStage,
  ProjectDuration,
  ProjectMethodology,
  WorkType,
  JobProfile,
  Request,
} from "@prisma/client";
import { Carousel } from "@/components/carousel";
import React from "react";
import { Noop } from "@/types/shared";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MyInput, MySelect, MySwitch } from "@/components/forms";
import {
  RequestMutationInput,
  draftRequestSchema,
  pendingRequestSchema,
  RequestSchema,
} from "@/types/prisma-types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { stringMin3 } from "@/types/prisma-extensions";

const defaultNumber = "" as unknown as number;

function InputBrand({ msg }: { msg: string }) {
  return (
    <span className="absolute right-0 top-0 flex h-full select-none items-center pr-4 text-sm text-muted-foreground">
      {msg}
    </span>
  );
}

const submitRequest = async (request: RequestMutationInput) => {
  const res = await fetch("/api/requests/create", {
    body: JSON.stringify(request),
    method: "POST",
  });

  return await res.json();
};

function useDirtyPrevent(...xs: UseFormReturn<any>[]) {
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const anyFormsDirty = xs.some((x) => x.formState.isDirty);

  const onFormDialogOpenChange = (shouldOpen: boolean) => {
    if (shouldOpen) return setFormDialogOpen(true);
    if (anyFormsDirty) return setAlertOpen(true);

    return setFormDialogOpen(false);
  };

  const onAlertCancel = () => {
    xs.forEach((x) => x.reset());
    setAlertOpen(false);
    setFormDialogOpen(false);
  };
  const onAlertContinue = () => {};

  return {
    alertOpen,
    formDialogOpen,
    onFormDialogOpenChange,
    onAlertCancel,
    onAlertContinue,
  };
}

export function RequestForm() {
  const { toast } = useToast();

  const [res, setRes] = useState<z.ZodSchema>(draftRequestSchema);

  const form = useForm<z.infer<typeof pendingRequestSchema>>({
    resolver: zodResolver(res),
    defaultValues: {
      availability: 50,
      description: "",
      name: "",
      hourlyRate: defaultNumber,
      noticePeriod: defaultNumber,
      domesticTravel: false,
      fundingGuaranteed: false,
      internationalTravel: false,
      pmExists: false,
      workSchema: { workType: "FULLY_REMOTE" },
    },
  });

  const { alertOpen, formDialogOpen, onFormDialogOpenChange, onAlertCancel } =
    useDirtyPrevent(form);

  const { mutate } = useMutation({
    mutationFn: submitRequest,
    onError: () => {
      toast({
        title: "Error saving request",
        description: "Please try resubmitting later",
      });
    },
    // TODO research why it is calling on success even though request fails
    onSuccess: () => {
      toast({
        title: "Saved successfully",
        // TODO add request name
        description: "Request has been saved",
      });
    },
    onSettled: () => {},
  });

  const saveDraft = async () => {
    //await commercialsForm.trigger();
  };

  const savePending = async () => {};

  const [availabilityRef] = useAutoAnimate();
  const [officeLocationRef] = useAutoAnimate();

  const workType = form.watch("workSchema")?.workType;

  const showOfficeLocation = workType !== "FULLY_REMOTE";
  const showDaysInOffice = workType === "HYBRID";

  function PreventFormClose({
    draftName = "",
  }: {
    draftName: string | undefined;
  }) {
    const draftForm = useForm<{ draftName: string }>({
      defaultValues: { draftName },
      resolver: zodResolver(z.object({ draftName: stringMin3 })),
    });

    return (
      <AlertDialog open={alertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Form is unsaved. Either save as draft or cancel (all the fields
              will be cleared).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Form {...draftForm}>
            <form noValidate onSubmit={draftForm.handleSubmit(saveDraft)}>
              <MyInput
                placeholder=""
                control={draftForm.control}
                label="Draft name"
                name="draftName"
              />
              <AlertDialogFooter>
                <AlertDialogCancel onClick={onAlertCancel}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type="submit">Save draft</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <React.Fragment>
      <Button onClick={() => onFormDialogOpenChange(true)}>
        Create new request
      </Button>
      <PreventFormClose draftName={form.getValues("name")} />

      <Dialog open={formDialogOpen} onOpenChange={onFormDialogOpenChange}>
        <DialogContent className="max-h-full overflow-y-auto overflow-x-hidden sm:max-h-[75%]">
          <DialogHeader>
            <DialogTitle className="pb-4">Job request</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(console.log)}
              noValidate
              className="space-y-8"
            >
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
              <FormField
                control={form.control}
                name="hourlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hourly rate</FormLabel>
                    <div className="relative">
                      <FormControl className="">
                        <Input placeholder="Hourly rate" {...field} />
                      </FormControl>
                      <InputBrand msg="PLN/hour" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consultant&apos;s availability</FormLabel>
                    <div
                      ref={availabilityRef}
                      className="flex items-center gap-4"
                    >
                      <FormControl>
                        <Slider
                          onValueChange={(e) => field.onChange(e[0])}
                          defaultValue={[field.value || 50]}
                          max={100}
                          step={10}
                        />
                      </FormControl>
                      <span
                        key={field.value}
                        className={cn(
                          "whitespace-nowrap font-normal text-muted-foreground",
                        )}
                      >{`${field.value}% FTE`}</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start date</FormLabel>
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
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date <= new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Expected start date of the engagement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-wrap">
                    <FormLabel>End date</FormLabel>
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
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date <= new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Expected end date of the engagement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="noticePeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice period</FormLabel>
                    <div className="relative">
                      <FormControl className="">
                        <Input placeholder="Notice period" {...field} />
                      </FormControl>
                      <InputBrand msg="days" />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <section ref={officeLocationRef}>
                <MySelect
                  control={form.control}
                  name="workSchema.workType"
                  label="Work location"
                  placeholder="Select work location"
                >
                  {Object.keys(WorkType).map((key) => (
                    <SelectItem
                      className="flex items-center"
                      key={key}
                      value={key}
                    >
                      <span>{WorkType[key as keyof typeof WorkType]}</span>
                    </SelectItem>
                  ))}
                </MySelect>
                {showDaysInOffice && (
                  <MyInput
                    control={form.control}
                    name="workSchema.daysInOffice"
                    label="Days in office"
                    placeholder="Days in office"
                  />
                )}
                {showOfficeLocation && (
                  <MyInput
                    control={form.control}
                    name="workSchema.officeLocation"
                    label="Office location"
                    placeholder="City where the office is located"
                  />
                )}
              </section>
              <MySwitch
                control={form.control}
                name="domesticTravel"
                label="Domestic travel"
                description="Check if domestic travels be required"
              />
              <MySwitch
                control={form.control}
                name="internationalTravel"
                label="International travel"
                description="Check if travelling abroad will be required"
              />
              <MyInput
                description=" This name will be visibile to vendors and help you identify the project among all the requests"
                control={form.control}
                label="Project name"
                name="name"
                placeholder="Give project a name"
              />
              <MySelect
                control={form.control}
                label="Project maturity"
                name="projectStage"
                placeholder="Select stage"
              >
                {Object.keys(ProjectStage).map((key) => (
                  <SelectItem key={key} value={key}>
                    {ProjectStage[key as keyof typeof ProjectStage]}
                  </SelectItem>
                ))}
              </MySelect>
              <MySelect
                control={form.control}
                label="Project duration"
                name="projectDuration"
                placeholder="Select duration"
              >
                {Object.keys(ProjectDuration).map((key) => (
                  <SelectItem key={key} value={key}>
                    {ProjectDuration[key as keyof typeof ProjectDuration]}
                  </SelectItem>
                ))}
              </MySelect>
              <MySelect
                control={form.control}
                label="Project methodology"
                name="projectMethodology"
                placeholder="Select methodology"
              >
                {Object.keys(ProjectMethodology).map((key) => (
                  <SelectItem key={key} value={key}>
                    {ProjectMethodology[key as keyof typeof ProjectMethodology]}
                  </SelectItem>
                ))}
              </MySelect>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <MySwitch
                control={form.control}
                name="fundingGuaranteed"
                label="Funding status"
                description="Check if project has guaranteed funding for the time of its duration"
              />
              <MySwitch
                control={form.control}
                name="pmExists"
                label="Project manager"
                description="Check if project is managed by a Project Manager"
              />
              <Button
                onClick={(e) => {
                  setRes(pendingRequestSchema);

                  e.target.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true }),
                  );
                }}
              >
                Submit full
              </Button>
              <Button
                onClick={(e) => {
                  setRes(draftRequestSchema);

                  e.target.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true }),
                  );
                }}
                type="submit"
              >
                Submit draft
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
