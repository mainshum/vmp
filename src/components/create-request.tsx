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
import { FieldValues, UseFormProps, useForm } from "react-hook-form";
import { SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  ProjectStage,
  ProjectDuration,
  ProjectMethodology,
  WorkType,
  JobProfile,
} from "@prisma/client";
import { Carousel } from "@/components/carousel";
import React from "react";
import { Noop } from "@/types/shared";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MyInput, MySelect, MySwitch } from "@/components/forms";
import {
  RequestModelPayload,
  commercialsSchema,
  projectSchema,
} from "@/types/prisma-types";

const defaultNumber = "" as unknown as number;

function InputBrand({ msg }: { msg: string }) {
  return (
    <span className="absolute right-0 top-0 flex h-full select-none items-center pr-4 text-sm text-muted-foreground">
      {msg}
    </span>
  );
}

const submitRequest = async (request: RequestModelPayload) => {
  const res = await fetch("/api/requests/create", {
    body: JSON.stringify(request),
    method: "POST",
  });

  return await res.json();
};

export default function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams?.toString());

  function setQueryParams(params: Record<string, string | undefined>) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        urlSearchParams.delete(key);
      } else {
        urlSearchParams.set(key, String(value));
      }
    });

    const search = urlSearchParams.toString();
    const query = search ? `?${search}` : "";
    // replace since we don't want to build a history
    router.replace(`${pathname}${query}`);
  }

  return { queryParams: searchParams, setQueryParams };
}

function useFormWithInitialValues<T extends z.ZodRawShape>(
  t: z.ZodObject<T>,
  objName: string,
  fallbackDefaults: UseFormProps<z.infer<typeof t>>["defaultValues"],
) {
  const searchParams = useSearchParams();

  const defaultValues: any = useMemo(() => {
    const formInit = searchParams.get(objName);

    if (!formInit) return fallbackDefaults;

    try {
      return t.parse(JSON.parse(formInit));
    } catch {
      return fallbackDefaults;
    }
  }, [searchParams, t, objName, fallbackDefaults]);

  return useForm<z.infer<typeof t>>({
    resolver: zodResolver(t),
    defaultValues: defaultValues,
  });
}

export function RequestForm() {
  const [page, setPage] = useState<"commercials" | "project">("commercials");

  const commercialsForm = useFormWithInitialValues(
    commercialsSchema,
    "commercials",
    {
      availability: defaultNumber,
      domesticTravel: false,
      hourlyRate: defaultNumber,
      noticePeriod: defaultNumber,
      startDate: addMonths(new Date(), 1),
      endDate: addMonths(new Date(), 1),
      workType: {
        workType: "HYBRID",
        officeLocation: "",
        daysInOffice: 1,
      },
    },
  );

  const projectForm = useFormWithInitialValues(projectSchema, "project", {
    description: "",
    name: "",
  });

  const router = useRouter();

  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationFn: () =>
      submitRequest({
        ...projectForm.getValues(),
        ...commercialsForm.getValues(),
      }),
    // eslint-disable-next-line no-unused-vars
    onError: (e) => {
      toast({
        title: "Error saving request",
        description: "Please try resubmitting later",
      });
    },
    // TODO research why it is calling on success even though request fails
    onSuccess: () => {
      router.push("/customer");
    },
  });

  return (
    <Carousel>
      {page === "commercials" && (
        <CommercialsForm
          onNext={() => setPage("project")}
          form={commercialsForm}
        />
      )}
      {page === "project" && (
        <ProjectForm onSubmit={mutate} form={projectForm} />
      )}
    </Carousel>
  );
}

export function ProjectForm({
  form,
  onSubmit,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof projectSchema>>>;
  onSubmit: Noop;
}) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-8"
      >
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
        {/* <MySwitch
          control={form.control}
          name="teamExists"
          label="Team"
          description="Check if there is a team working on this project already"
        />

        <FormField
          control={form.control}
          name="teamCountries"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Team countries</FormLabel>
              <div>
                {field.value &&
                  field.value.map((f) => <Button key={f}>{f}</Button>)}

                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        Add country
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search country..." />
                      <CommandEmpty>No matching country.</CommandEmpty>
                      <CommandList className="max-h-[200px] overflow-auto">
                        {COUNTRIES.map((ctr) => (
                          <CommandItem
                            value={ctr.name}
                            key={ctr.name}
                            onSelect={() => {
                              form.setValue("teamCountries", [
                                ...field.value,
                                ctr.name,
                              ]);
                            }}
                          >
                            {ctr.name}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </Command>{" "}
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button type="submit">Save request</Button>
      </form>
    </Form>
  );
}

// eslint-disable-next-line react/display-name
const CommercialsForm = ({
  form,
  onNext,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof commercialsSchema>>>;
  onNext: Noop;
}) => {
  const [availabilityRef] = useAutoAnimate();
  const [officeLocationRef] = useAutoAnimate();

  const workType = form.watch("workType")?.workType;

  const showOfficeLocation = workType !== "FULLY_REMOTE";
  const showDaysInOffice = workType === "HYBRID";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
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
              <div ref={availabilityRef} className="flex items-center gap-4">
                <FormControl>
                  <Slider
                    onValueChange={(e) => field.onChange(e[0])}
                    defaultValue={[field.value]}
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
            name="workType.workType"
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
              name="workType.daysInOffice"
              label="Days in office"
              placeholder="Days in office"
            />
          )}
          {showOfficeLocation && (
            <MyInput
              control={form.control}
              name="workType.officeLocation"
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
        <Button type="submit">Next</Button>
      </form>
    </Form>
  );
};
