"use client";
import { useRef, useEffect } from "react";

import Header from "@/components/home/header-input";
import IdeaCard from "@/components/global/cards/idea-card";
import EmptyState from "@/components/global/components/empty-state";
import { Spinner } from "@/components/ui/spinner";

import { useIdeaStore } from "@/store/idea.store";

const input = {
  placeholder: "Search ideas by title . . . ",
};

export default function Home() {
  const { fetchIdeas, ideas, fetching, hasMore } = useIdeaStore();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !fetching) {
          fetchIdeas();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [fetchIdeas]);

  return (
    <div className="">
      <Header heading="Top Ideas" input={input} />

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 px-6">
        {ideas.map((item, index) => (
          <IdeaCard key={index} idea={item} />
        ))}
      </div>

      <div className="p-12 text-center">
        {fetching ? "Fetching more ideas . . . ." : ""}
      </div>
      <div ref={loaderRef} />
    </div>
  );
}
