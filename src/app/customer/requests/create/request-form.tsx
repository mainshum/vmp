"use client";

import { Software } from "./tech";
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
import { CalendarIcon, Circle } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Textarea } from "@/components/ui/textarea";
import {
  ProjectStage,
  ProjectDuration,
  ProjectMethodology,
  WorkType,
  JobProfile,
  JobSubProfile,
} from "@prisma/client";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { MyInput, MySelect, MySwitch } from "@/components/forms";
import { RequestClient } from "@/lib/data";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { RequestModel, RequestPutModel } from "@/types/request";
import { RequestModel as RM } from "zod-types";
import { Checkbox } from "@/components/ui/checkbox";
import { match } from "ts-pattern";
import clsx from "clsx";
import SideNav from "@/components/side-nav";
import { Children } from "@/types/shared";
import { z } from "zod";
import { Error } from "@/components/success";
import { stringMin3, positiveInteger15 } from "@/types/prisma-extensions";

const JobProfileModel = RM.omit({
  id: true,
  creationDate: true,
  validUntil: true,
})
  .extend({
    daysInOffice: z.any(),
    officeLocation: z.any(),
  })
  .transform(({ ...rest }, ctx) => {
    if (rest.workType === "FULLY_REMOTE")
      return { ...rest, daysInOffice: null, officeLocation: null };

    const ol = stringMin3.safeParse(rest.officeLocation);
    const dio = positiveInteger15.safeParse(rest.daysInOffice);

    if (!ol.success) {
      ctx.addIssue({
        path: ["officeLocation"],
        message: ol.error.issues[0].message,
        code: "custom",
      });
    }

    if (rest.workType === "HYBRID" && !dio.success) {
      ctx.addIssue({
        path: ["daysInOffice"],
        message: dio.error.issues[0].message,
        code: "custom",
      });
    }

    return {
      ...rest,
      daysInOffice: dio.success ? dio.data : null,
      officeLocation: ol.success ? ol.data : null,
    };
  });

type JobProfileModel = z.infer<typeof JobProfileModel>;

function InputBrand({ msg }: { msg: string }) {
  return (
    <span className="absolute right-0 top-0 flex h-full select-none items-center pr-4 text-sm text-muted-foreground">
      {msg}
    </span>
  );
}
const C = () => <Circle fill="black" className="h-2 w-2 " />;

const A = ({ href, children }: { href: string; children: Children }) => (
  <a className="block text-slate-500" href={href}>
    {children}
  </a>
);

const Page = z.union([
  z.literal("jpf"),
  z.literal("technical"),
  z.literal("other"),
]);

function FormNavigation({ page }: { page: z.infer<typeof Page> }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className={clsx(page === "jpf" && `text-2xl font-bold`)}>
        Job profile
      </span>
      <C />
      <span className={clsx(page === "technical" && `text-2xl font-bold`)}>
        Technical
      </span>
      <C />
      <span className={clsx(page === "other" && `text-2xl font-bold`)}>
        Other
      </span>
    </div>
  );
}

type RequestFormState =
  | { type: "jpf" }
  | {
      type: "technical";
      requestId: string;
      techTree: TechTree;
      technical: RequestModel["technical"];
    }
  | { type: "error" };

export const RequestForm = ({
  initRequest,
}: {
  initRequest?: RequestModel;
}) => {
  const sp = useSearchParams();

  const [request, setRequest] = useState<RequestModel | undefined>(initRequest);

  const page = sp.get("page");

  const parsedState: RequestFormState = useMemo(() => {
    const parsedPage = Page.safeParse(page);
    if (!parsedPage.success) return { type: "error" };

    if (parsedPage.data == "jpf") return { type: "jpf" };

    if (!request) return { type: "error" };

    const techTree = match(request.profile)
      .with(JobProfile.SOFTWARE_ENGINEER, () => {
        return match(request.subProfile)
          .with(JobSubProfile.BACKEND, () => Software.backend)
          .with(JobSubProfile.FRONTEND, () => Software.frontend)
          .with(JobSubProfile.FULLSTACK, () => Software.fullstack)
          .with(JobSubProfile.MOBILE, () => Software.mobile)
          .exhaustive();
      })
      .otherwise(() => Software.mobile);

    return {
      type: "technical",
      requestId: request.id,
      techTree,
      technical: request.technical,
    };
  }, [request, page]);

  if (parsedState.type === "error") {
    return <Error />;
  }

  return (
    <div className="flex justify-center gap-8 px-8 lg:justify-between">
      <div className="hidden w-10 shrink-[100] lg:block"></div>
      <div className="flex flex-col items-start py-8">
        <FormNavigation page={parsedState.type} />
        {match(parsedState)
          .with({ type: "jpf" }, () => (
            <JobProfileForm onFilled={setRequest} data={request} />
          ))
          .with({ type: "technical" }, ({ techTree, requestId, technical }) => (
            <TechnicalForm
              techTree={techTree}
              requestId={requestId}
              technical={technical}
            />
          ))
          .exhaustive()}
      </div>
      <SideNav className="sticky top-[56px] h-[calc(100vh-56px)] shrink-0 translate-x-[30px] gap-3 pt-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-lg font-semibold">On this page</h1>
          {match(parsedState)
            .with({ type: "jpf" }, () => (
              <>
                <A href="#profile">Profile</A>
                <A href="#availability">Availability</A>
                <A href="#travel">Travel requirements</A>
                <A href="#project">Project details</A>
              </>
            ))
            .with({ type: "technical" }, ({ techTree }) => (
              <>
                {Object.entries(techTree).map(([level0, { label }]) => (
                  <A key={level0} href={`#${level0}`}>
                    {label}
                  </A>
                ))}
              </>
            ))
            .exhaustive()}
        </div>
      </SideNav>
    </div>
  );
};

// TODO make it work
const useScrollTop = () => {
  return useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};

type TechTree = Record<string, { label: string; tech: Record<string, string> }>;

export function TechnicalForm({
  requestId,
  technical,
  techTree,
}: {
  requestId: string;
  technical: RequestModel["technical"];
  techTree: TechTree;
}) {
  const form = useForm({
    defaultValues: technical || {},
  });

  useScrollTop();

  const { toast } = useToast();
  const client = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (xs: Record<string, Record<string, true | undefined>>) => {
      const technical = Object.keys(xs).reduce(
        (acc, key) => ({
          ...acc,
          ...Object.entries(xs[key as keyof typeof xs])
            .filter(([, val]) => val)
            .flatMap(([key]) => key)
            .reduce(
              (acc, tech) => {
                if (!(key in acc)) {
                  acc[key] = {};
                }
                acc[key][tech] = true;
                return acc;
              },
              {} as Record<string, Record<string, true>>,
            ),
        }),
        {} as Record<string, Record<string, true>>,
      );

      return RequestClient.put(requestId, RequestPutModel.parse({ technical }));
    },
    throwOnError: true,
    onMutate: () => {
      toast({ title: "Saving..." });
    },
    onError: () => {
      toast({
        title: "Error saving request",
        description: "Please try resubmitting the form",
      });
    },
    onSuccess: (data) => {
      const updated = RM.parse(data);
      client.setQueryData(["customer", "requests", updated.id], updated);
      toast({ title: "Saved!" });
    },
  });

  return (
    <Form {...form}>
      <a className="hop-anchor top-[-45px]" id="top" />
      <form className="pt-4" onSubmit={form.handleSubmit(() => {})}>
        {Object.entries(techTree).map(([level0, { label, tech }]) => {
          return (
            <div key={level0}>
              <a className="hop-anchor top-[-50px]" id={level0} />
              <h1 className="mb-2 border-b-2 border-slate-100 py-3 text-lg font-bold">
                {label}
              </h1>
              <ul>
                {Object.entries(tech).map(([techKey, techLabel]) => {
                  return (
                    <FormField
                      key={`${level0}.${techKey}}`}
                      control={form.control}
                      name={`${level0}.${techKey}`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>{techLabel}</FormLabel>
                        </FormItem>
                      )}
                    />
                  );
                })}
              </ul>
            </div>
          );
        })}
        <section className="flex justify-end gap-4">
          <Button onClick={form.handleSubmit((e) => mutate(e))}>Submit</Button>
        </section>
      </form>
    </Form>
  );
}

export const JobProfileForm = ({
  data,
  onFilled,
}: {
  data: RequestModel | undefined;
  // eslint-disable-next-line no-unused-vars
  onFilled: (rm: RequestModel) => void;
}) => {
  const { toast } = useToast();

  const client = useQueryClient();

  useScrollTop();

  const form = useForm<JobProfileModel>({
    resolver: zodResolver(JobProfileModel),
    defaultValues: {
      availability: data?.availability || 50,
      description: data?.description || "",
      subProfile: data?.subProfile || undefined,
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
      officeLocation: data?.officeLocation || "",
      daysInOffice: data?.daysInOffice || ("" as unknown as number),
      status: "PENDING",
    },
  });

  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: (xs: JobProfileModel) => {
      if (data?.id) return RequestClient.put(data.id, xs);

      return RequestClient.post(xs);
    },
    onMutate: () => {
      toast({ title: "Saving..." });
    },
    onError: () => {
      toast({
        title: "Error saving request",
        description: "Please try resubmitting the form",
      });
    },
    onSuccess: (data) => {
      const updated = RM.parse(data);
      client.setQueryData(["customer", "requests", updated.id], updated);
      onFilled(updated);

      const url = new URL(window.location.href);

      url.searchParams.set("profile", updated.profile);
      url.searchParams.set("page", "technical");

      router.push(url.toString());
    },
  });

  const [availabilityRef] = useAutoAnimate();
  const [officeLocationRef] = useAutoAnimate();

  const workType = form.watch("workType");
  const profile = form.watch("profile");

  const subProfile: JobSubProfile[] = match(profile)
    .with(JobProfile.SOFTWARE_ENGINEER, () => [
      JobSubProfile.BACKEND,
      JobSubProfile.FRONTEND,
      JobSubProfile.FULLSTACK,
      JobSubProfile.MOBILE,
    ])
    .with(JobProfile.DATA_SPECIALIST, () => [])
    .with(JobProfile.DEVOPS, () => [])
    .with(JobProfile.QUALITY_ASSURANCE, () => [])
    .otherwise(() => []);

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
        <MyInput
          description=" This name will be visibile to vendors and help you identify the project among all the requests."
          control={form.control}
          label="Request name"
          name="name"
          placeholder="Give request a name"
        />
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
};
