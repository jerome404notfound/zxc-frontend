import { Skeleton } from "./skeleton";

export default function SkeletonCard1() {
  return (
    <div className="">
      <Skeleton className="aspect-2/3 w-full" />
      <div className="mt-3 space-y-1">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
