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
  Seniority,
  JobSubProfile,
} from "@prisma/client";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MyInput, MySelect, MySwitch } from "@/components/forms";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { match } from "ts-pattern";
import clsx from "clsx";
import SideNav from "@/components/side-nav";
import { Children } from "@/types/shared";
import { z } from "zod";
import { Error } from "@/components/success";
import { RouterOutputs, trpc } from "@/lib/trpc";
import { RequestInput } from "@/lib/validation";

type RequestData = RouterOutputs["request"];

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
      technical: Exclude<RequestData, null>["technical"];
    }
  | { type: "error" };

export const RequestForm = ({ initRequest }: { initRequest: RequestData }) => {
  const sp = useSearchParams();

  const [request, setRequest] = useState<RequestData>(initRequest);

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
          .with({ type: "technical" }, () => <div>Placeholder</div>)
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
            .with({ type: "technical" }, () => <div>Placeholder</div>)
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

type CreateUpdateRequestOutput = RouterOutputs["upsertRequest"];

export const JobProfileForm = ({
  data,
  onFilled,
}: {
  data: RequestData;
  // eslint-disable-next-line no-unused-vars
  onFilled: (rm: CreateUpdateRequestOutput) => void;
}) => {
  const { toast } = useToast();

  useScrollTop();

  const form = useForm<RequestInput>({
    resolver: zodResolver(RequestInput),
    defaultValues: {
      availability: data?.availability || 50,
      description: data?.description || "",
      profile: data?.profile || undefined,
      subProfile: data?.subProfile || undefined,
      seniority: data?.seniority || undefined,
      workType: data?.workType || undefined,
      domesticTravel: data?.domesticTravel || false,
      internationalTravel: data?.internationalTravel || false,
      startDate: data?.startDate ? new Date(data.startDate) : undefined,
      endDate: data?.endDate ? new Date(data.endDate) : undefined,
      fundingGuaranteed: data?.fundingGuaranteed || false,
      hourlyRate: data?.hourlyRate || ("" as unknown as number),
      noticePeriod: data?.noticePeriod || ("" as unknown as number),
      name: data?.name || "",
      pmExists: data?.pmExists || false,
      projectDuration: data?.projectDuration || undefined,
      projectMethodology: data?.projectMethodology || undefined,
      projectStage: data?.projectStage || undefined,
      officeLocation: data?.officeLocation || "",
      daysInOffice: data?.daysInOffice || ("" as unknown as number),
      status: "PENDING",
    },
  });

  const router = useRouter();

  const { mutate } = trpc.upsertRequest.useMutation({
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
      onFilled(data);

      const url = new URL(window.location.href);

      url.searchParams.set("profile", data.profile);
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

  console.log(form.formState.errors);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() =>
          mutate({ id: data?.id, requestPostModel: form.getValues() }),
        )}
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
          <Button type="submit">Next page</Button>
        </section>
      </form>
    </Form>
  );
};
