import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="center-absolute">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
}

export default Loader;
