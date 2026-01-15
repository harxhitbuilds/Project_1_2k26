import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { IRequest } from "@/types/request";

export default function RequestCard({
  request,
  slug,
  onAccept,
  onReject,
  loading,
}: {
  request: IRequest;
  slug: string;
  onAccept: (slug: string, requesterId: string) => void;
  onReject: (slug: string, requesterId: string) => void;
  loading: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={request.userId.profile} />
          <AvatarFallback>{request.userId.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{request.userId.name}</p>
          <p className="text-xs text-muted-foreground">
            Wants to join as{" "}
            <span className="font-semibold">{request.role}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReject(slug, request.userId._id)}
          disabled={loading}
        >
          Reject
        </Button>
        <Button
          size="sm"
          onClick={() => onAccept(slug, request.userId._id)}
          disabled={loading}
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
