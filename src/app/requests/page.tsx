import { appRouter, createContext } from "@/server/trpc-server";

async function Index() {
  const caller = appRouter.createCaller(await createContext());

  const data = await caller.requests();
  return <div className="container">{JSON.stringify(data, null, 2)}</div>;
}
export default Index;
