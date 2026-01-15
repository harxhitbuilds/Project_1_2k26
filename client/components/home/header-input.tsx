"use client";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { useIdeaStore } from "@/store/idea.store";

export default function HeaderInput({
  heading,
  input,
}: {
  heading: string;
  input: { placeholder: string };
}) {
  const { searchIdeas } = useIdeaStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      searchIdeas(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query, searchIdeas]);

  return (
    <div className="w-full flex flex-col space-y-6  md:flex md:flex-row md:items-center md:space-y-0 md:justify-between py-6 px-6">
      <div>
        <h1 className="text-2xl font-semibold">{heading}</h1>
      </div>
      <div>
        <Input
          placeholder={input.placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
