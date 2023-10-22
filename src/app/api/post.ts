export function PostFactory<T>(
  schema: Zod.ZodSchema<T>,
  // eslint-disable-next-line no-unused-vars
  updater: (parsed: T) => Promise<any>,
) {
  return async (req: Request) => {
    const parsed = schema.safeParse(await req.json());

    if (!parsed.success)
      return new Response(JSON.stringify({ errors: parsed.error.errors }), {
        status: 404,
      });

    try {
      const res = await updater(parsed.data);
      return new Response(JSON.stringify(res));
    } catch (err) {
      return new Response(JSON.stringify(err), { status: 404 });
    }
  };
}
