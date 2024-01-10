import { LucideProps } from "lucide-react";

const Icons = {
  linkedin: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  ),
  logo: (props: LucideProps) => (
    <svg
      {...props}
      width="38"
      height="36"
      viewBox="0 0 38 36"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="13.6992"
        y="31.127"
        width="34.4065"
        height="9.69775"
        rx="4.84887"
        transform="rotate(-63 13.6992 31.127)"
      />
      <circle cx="7.02119" cy="18.2922" r="7.02119" />
    </svg>
  ),
};

export default Icons;
