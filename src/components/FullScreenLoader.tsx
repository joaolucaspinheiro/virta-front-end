import { Loader2 } from "lucide-react";

export function FullScreenLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
    </div>
  );
}
