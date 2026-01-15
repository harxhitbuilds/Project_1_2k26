import { Button } from "@/components/ui/button";
import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref = "#",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 px-6 space-y-4 border-none rounded-lg">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>

      {actionLabel && (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
