export default async function Home() {
  return (
    <>
      <section className="p-32">
        <h1 className="text-3xl font-bold">
          IT procurement platform driven by technology
        </h1>
        <p className="pt-4 text-xl">
          submit IT job requests to receive selection of offers from our{" "}
          <b>trusted vendors</b> <br />
          gain market insight and select the best <br />
          use AI to help you choose
        </p>
      </section>
      <div className="fixed bottom-0 flex aspect-square w-[300%] translate-x-[-32.5%] translate-y-[95%] justify-center rounded-full bg-black pt-32">
        <p className="basis-[50vw] text-center text-2xl text-white">
          post anonymized IT job requests and receive a wide selection of offers
          from our <b>trusted vendors</b>
        </p>
      </div>
    </>
  );
}
