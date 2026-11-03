import { ResultSkeleton } from "@/components/landing/results/result-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <ResultSkeleton />
    </div>
  );
}
