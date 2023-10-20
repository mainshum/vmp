import { useAutoAnimate } from "@formkit/auto-animate/react";

export function Carousel({ children }: { children: React.ReactNode }) {
  const [ref] = useAutoAnimate();

  return <div ref={ref}>{children}</div>;
}
