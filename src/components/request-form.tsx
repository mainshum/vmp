"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ProjectStage,
  ProjectDuration,
  ProjectMethodology,
  WorkType,
  JobProfile,
} from "@prisma/client";
import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MyInput, MySelect, MySwitch } from "@/components/forms";
import { getRequest, postNewRequest } from "@/lib/data";
import { useSearchParams } from "next/navigation";
import { ROUTES } from "@/lib/const";
import Loader from "@/app/customer/loading";
import { useRouter } from "next/navigation";
import { RequestFormModel, RequestModel } from "@/types/request";

function InputBrand({ msg }: { msg: string }) {
  return (
    <span className="absolute right-0 top-0 flex h-full select-none items-center pr-4 text-sm text-muted-foreground">
      {msg}
    </span>
  );
}

export function RequestForm() {
  const requestId = useSearchParams().get("requestId");

  const { data, isLoading } = useQuery({
    queryKey: ["requests", requestId],
    queryFn: async () => {
      if (!requestId) return undefined;
      const request = await getRequest(requestId);
      return request;
    },
    enabled: !!requestId,
    throwOnError: true,
  });

  return isLoading ? <Loader /> : <EditRequestForm data={data} />;
}

function EditRequestForm({ data }: { data: RequestModel | undefined }) {
  const { toast } = useToast();

  const client = useQueryClient();
  const router = useRouter();

  const form = useForm<RequestFormModel>({
    resolver: zodResolver(RequestFormModel),
    defaultValues: {
      availability: data?.availability || 50,
      description: data?.description || "",
      workType: data?.workType || undefined,
      domesticTravel: data?.domesticTravel || false,
      internationalTravel: data?.internationalTravel || false,
      startDate: data?.startDate ? new Date(data.startDate) : undefined,
      endDate: data?.endDate ? new Date(data.endDate) : new Date(),
      fundingGuaranteed: data?.fundingGuaranteed || false,
      hourlyRate: data?.hourlyRate || ("" as unknown as number),
      noticePeriod: data?.noticePeriod || ("" as unknown as number),
      name: data?.name || "",
      pmExists: data?.pmExists || false,
      profile: data?.profile || undefined,
      projectDuration: data?.projectDuration || undefined,
      projectMethodology: data?.projectMethodology || undefined,
      projectStage: data?.projectStage || undefined,
      officeLocation: data?.officeLocation,
      daysInOffice: data?.daysInOffice,
      status: "PENDING",
    },
  });

  console.log(form.formState.errors);

  const { mutate } = useMutation({
    mutationFn: (xs: RequestFormModel) => {
      debugger;
      // TODO put
      return postNewRequest(xs);
    },
    onMutate: () => {
      toast({ title: "Saving request..." });
    },
    onError: () => {
      toast({
        title: "Error saving request",
        description: "Please try resubmitting the form",
      });
    },
    onSuccess: ({ name, id }) => {
      toast({
        title: "Saved successfully",
        description: `Request ${name} has been saved`,
      });
      client.invalidateQueries({ queryKey: ["requests", id] });

      router.push(ROUTES.CUSTOMER.REQUESTS.ONE(id));
    },
  });

  const [availabilityRef] = useAutoAnimate();
  const [officeLocationRef] = useAutoAnimate();

  const workType = form.watch("workType");

  const showOfficeLocation = workType === "ONSITE" || workType === "HYBRID";
  const showDaysInOffice = workType === "HYBRID";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => mutate(form.getValues()))}
        noValidate
        className="space-y-8"
      >
        <a className="hop-anchor top-[-45px]" id="profile" />
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
          name="status"
          render={({ field }) => <Input className="hidden" {...field} />}
        />
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
        <a className="hop-anchor" id="availability" />
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consultant&apos;s availability</FormLabel>
              <div ref={availabilityRef} className="flex items-center gap-4">
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
        <a className="hop-anchor" id="travel" />
        <section ref={officeLocationRef}>
          <MySelect
            control={form.control}
            name="workType"
            label="Work location"
            placeholder="Select work location"
          >
            {Object.keys(WorkType).map((key) => (
              <SelectItem className="flex items-center" key={key} value={key}>
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
        <a className="hop-anchor" id="project" />
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
          <Button onClick={form.handleSubmit((e) => mutate(e))}>
            Next page
          </Button>
        </section>
      </form>
    </Form>
  );
}
