"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

import type { IIdea } from "@/types/idea";

interface MyTeamCardProps {
  idea: IIdea;
  onManage?: () => void;
}

export default function MyTeamCard({ idea, onManage }: MyTeamCardProps) {
  const totalMembers = idea.teamMembers.length + 1;

  return (
    <Card className="max-w-md border border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold truncate max-w-62">{idea.title}</h3>
          <Badge variant="secondary" className="text-xs">
            {totalMembers} Members
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted p-3 space-y-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={idea.owner.profile} />
              <AvatarFallback>{idea.owner.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate">
                  {idea.owner.name}
                </p>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <Badge variant="outline" className="text-xs">
            Owner
          </Badge>
        </div>

        <div className="border-t" />

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Team Members
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {idea.teamMembers.map((member) => (
              <div
                key={member.userId._id}
                className="flex items-start gap-2 rounded-md p-2 transition-colors hover:bg-muted"
              >
                <Avatar className="h-7 w-7 mt-0.5 shrink-0">
                  <AvatarImage src={member.userId.profile} />
                  <AvatarFallback>
                    {member.userId.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {member.userId.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {onManage && (
          <div className="pt-2 flex justify-end">
            <Button variant="ghost" size="sm" onClick={onManage}>
              Manage Team
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
