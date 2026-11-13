import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Usually a button or link that solves the empty state ("Create the first one"). */
  action?: ReactNode;
  /** Smaller version for use inside a card. */
  compact?: boolean;
};

/** Friendly "nothing here yet" block: icon, short explanation and the next step. */
export function EmptyState({ icon: Icon, title, description, action, compact }: Props) {
  return (
    <div
      className={`grid place-items-center text-center ${
        compact ? "gap-2 py-8" : "gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-14"
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 -m-2 rounded-full bg-brand-500/5" aria-hidden="true" />
        <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/10 text-brand-500">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
      <div className="max-w-sm space-y-1">
        <p className="font-semibold text-zinc-900">{title}</p>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
