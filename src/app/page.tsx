export default function Home() {
  return (
    <section className="relative h-[calc(100vh-56px)] overflow-hidden p-32">
      <section>
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
      <div className="absolute bottom-0 right-0 hidden aspect-square w-[500px] -translate-x-32 translate-y-32 items-center justify-center rounded-full bg-black p-16 lg:flex">
        <p className="text-center text-2xl text-white">
          post anonymized IT job requests and receive a wide selection of offers
          from our <b>trusted vendors</b>
        </p>
      </div>
    </section>
  );
}
