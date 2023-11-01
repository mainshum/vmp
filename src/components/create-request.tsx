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
import { useForm } from "react-hook-form";
import { SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  ProjectStage,
  ProjectDuration,
  ProjectMethodology,
  WorkType,
  JobProfile,
  Request,
  RequestStatus,
} from "@prisma/client";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MyInput, MySelect, MySwitch } from "@/components/forms";
import {
  RequestFormValues,
  draftSchema,
  pendingSchema,
} from "@/types/prisma-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { NavigationBlocker } from "./navigation-blocker";
import { Noop } from "@/types/shared";

function InputBrand({ msg }: { msg: string }) {
  return (
    <span className="absolute right-0 top-0 flex h-full select-none items-center pr-4 text-sm text-muted-foreground">
      {msg}
    </span>
  );
}

const submitRequest = async (
  request: RequestFormValues,
  status: RequestStatus,
  id: string | undefined,
) => {
  const body = JSON.stringify({ ...request, status });

  const res = id
    ? await fetch(`api/requests?id=${id}`, { method: "PUT", body })
    : await fetch(`api/requests`, { method: "POST", body });

  if (res.status !== 200) throw new Error(await res.json());

  const json = await res.json();

  return json;
};

export function RequestForm({
  request,
  onCloseRequest,
}: {
  request?: Request;
  onCloseRequest: Noop;
}) {
  const { toast } = useToast();

  const resolverSchema = useRef<z.ZodSchema>(draftSchema);

  const client = useQueryClient();

  const form = useForm<RequestFormValues>({
    resolver: (values) => {
      const parsed = resolverSchema.current.safeParse(values);

      return {
        values: !parsed.success ? {} : values,
        errors: parsed.success
          ? {}
          : parsed.error.errors.reduce((acc, currentError) => {
              return {
                ...acc,
                [currentError.path[0]]: currentError,
              };
            }, {}),
      };
    },
    defaultValues: {
      availability: request?.availability || 50,
      description: request?.description,
      workType: request?.workType,
      domesticTravel: request?.domesticTravel || false,
      internationalTravel: request?.internationalTravel || false,
      startDate: request?.startDate ? new Date(request.startDate) : undefined,
      endDate: request?.endDate ? new Date(request.endDate) : undefined,
      fundingGuaranteed: request?.fundingGuaranteed || false,
      hourlyRate: request?.hourlyRate,
      noticePeriod: request?.noticePeriod,
      name: request?.name || "",
      pmExists: request?.pmExists || false,
      profile: request?.profile,
      projectDuration: request?.projectDuration,
      projectMethodology: request?.projectMethodology,
      projectStage: request?.projectStage,
      officeLocation: request?.officeLocation,
      daysInOffice: request?.daysInOffice,
    } satisfies RequestFormValues,
  });

  const clearFormAndClose = () => {
    form.reset();
    setBlockerOpen(false);
    onCloseRequest();
  };

  const { mutate } = useMutation({
    mutationFn: (xs: RequestFormValues) =>
      submitRequest(
        xs,
        resolverSchema.current === draftSchema ? "DRAFT" : "PENDING",
        request?.id,
      ),
    onMutate: () => {
      clearFormAndClose();
      toast({ title: "Saving request..." });
    },
    onError: () => {
      toast({
        title: "Error saving request",
        description: "Please try resubmitting the form",
      });
    },
    onSuccess: (_x, { name }) => {
      toast({
        title: "Saved successfully",
        description: `Request ${name} has been saved`,
      });
      client.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const [availabilityRef] = useAutoAnimate();
  const [officeLocationRef] = useAutoAnimate();

  const workType = form.watch("workType");

  const showOfficeLocation = workType === "ONSITE" || workType === "HYBRID";
  const showDaysInOffice = workType === "HYBRID";

  const [blockerOpen, setBlockerOpen] = useState<boolean>(false);

  const onFormOpenChange = () => {
    if (!blockerOpen && Object.keys(form.formState.dirtyFields).length > 0)
      return setBlockerOpen(true);

    onCloseRequest();
  };

  const dialogTitle = request?.id ? "Edit request" : "New job request";

  return (
    <React.Fragment>
      <NavigationBlocker
        open={blockerOpen}
        onAction={clearFormAndClose}
        onCancel={() => setBlockerOpen(false)}
      />
      <Dialog defaultOpen onOpenChange={onFormOpenChange}>
        <DialogContent className="max-h-full overflow-y-auto overflow-x-hidden sm:max-h-[75%]">
          <DialogHeader>
            <DialogTitle className="pb-4">{dialogTitle}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(() => mutate(form.getValues()))}
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
                        <Input
                          placeholder="Hourly rate"
                          {...field}
                          value={field.value ? field.value : ""}
                        />
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
                          onSelect={field.onChange}
                          disabled={(date) => date <= new Date()}
                          initialFocus
                          {...(field.value ? { selected: field.value } : {})}
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
                          onSelect={field.onChange}
                          disabled={(date) => date <= new Date()}
                          initialFocus
                          {...(field.value ? { selected: field.value } : {})}
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
                        <Input
                          placeholder="Notice period"
                          {...field}
                          value={field.value || ""}
                        />
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
                  name="workType"
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
                    name="daysInOffice"
                    label="Days in office"
                    placeholder="Days in office"
                  />
                )}
                {showOfficeLocation && (
                  <MyInput
                    control={form.control}
                    name="officeLocation"
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
                        value={field.value || ""}
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
              <section className="flex justify-end gap-4">
                <Button
                  variant="subtle"
                  onClick={(e) => {
                    resolverSchema.current = draftSchema;

                    e.target.dispatchEvent(
                      new Event("submit", {
                        cancelable: true,
                        bubbles: true,
                      }),
                    );
                  }}
                  type="submit"
                >
                  Save as draft
                </Button>
                <Button
                  onClick={(e) => {
                    resolverSchema.current = pendingSchema;

                    e.target.dispatchEvent(
                      new Event("submit", {
                        cancelable: true,
                        bubbles: true,
                      }),
                    );
                  }}
                >
                  Submit request
                </Button>
              </section>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
