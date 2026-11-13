import type { ReactNode } from "react";

/**
 * Gray placeholders with the shape of the content that is loading. They feel faster
 * than a spinner because the layout doesn't jump when the data arrives.
 */

function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-zinc-200/70 ${className}`} />;
}

/** Wrapper that announces "loading" once to screen readers. */
function LoadingRegion({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div role="status" aria-busy="true" aria-label="Carregando" className={className}>
      {children}
    </div>
  );
}

/** Dashboard: three metric cards, the chart and the recent list. */
export function DashboardSkeleton() {
  return (
    <LoadingRegion className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
            <Bone className="h-4 w-24" />
            <Bone className="h-7 w-36" />
          </div>
        ))}
      </div>
      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6">
        <Bone className="h-5 w-40" />
        <div className="flex h-56 items-end gap-3">
          {[40, 70, 55, 85, 60, 75].map((height, i) => (
            <div key={i} className="flex-1 animate-pulse rounded-md bg-zinc-200/70" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <ListRows rows={4} />
      </div>
    </LoadingRegion>
  );
}

function ListRows({ rows }: { rows: number }) {
  return (
    <div className="divide-y divide-zinc-100">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          <Bone className="h-9 w-9 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Bone className="h-4 w-1/3" />
            <Bone className="h-3 w-1/5" />
          </div>
          <Bone className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

/**
 * Rows of a list (transactions, members, categories...).
 * `bare`: no card around it, for lists that already live inside a card.
 */
export function ListSkeleton({ rows = 5, bare = false }: { rows?: number; bare?: boolean }) {
  return (
    <LoadingRegion className={bare ? "" : "rounded-2xl border border-zinc-200 bg-white p-6"}>
      <ListRows rows={rows} />
    </LoadingRegion>
  );
}
