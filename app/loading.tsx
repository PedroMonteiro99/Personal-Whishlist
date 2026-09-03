import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3 max-w-md" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-border/70 bg-card/80"
            >
              <Skeleton className="aspect-[4/3] rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only" role="status">
        A carregar conteúdo
      </span>
    </section>
  );
}
