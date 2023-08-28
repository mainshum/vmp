import Postings from "@/components/postings";
import { headers } from "next/headers";

async function PageServer() {
  const res = await fetch("http://localhost:3000/api/postings", {
    headers: headers(),
  });

  const data = await res.json();

  return <Postings postings={data} />;
}

export default PageServer;
