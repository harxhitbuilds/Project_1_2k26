"use client";
import { useEffect } from "react";

import Markdown from "@/components/global/components/markdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useIdeaStore } from "@/store/idea.store";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function Idea() {
  const { fetchIdeaBySlug, currentIdea } = useIdeaStore();
  const { slug } = useParams();

  useEffect(() => {
    fetchIdeaBySlug(slug);
  }, [fetchIdeaBySlug]);

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link href={`/home/profile/${currentIdea?.owner?.username}`}>
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentIdea?.owner?.profile} />
                <AvatarFallback>HP</AvatarFallback>
              </Avatar>

              <div className="leading-tight">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">
                    {currentIdea?.owner?.name}
                  </p>
                  <span className="text-muted-foreground text-sm">
                    @{currentIdea?.owner?.username}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Posted 2 days ago
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="space-y-6 border-t border-border pt-4">
          <div>
            <p className="text-sm font-medium mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {currentIdea?.technologies?.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Team Members</p>
            <div className="flex items-center gap-3">
              {currentIdea?.teamMembers?.map((member, index) => (
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar key={index} className="h-8 w-8">
                      <AvatarImage src={member.userId?.profile} />
                      <AvatarFallback>
                        {member?.userId.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{member.userId.username}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
          <Markdown content={currentIdea?.description} />
        </div>
      </div>
    </div>
  );
}
