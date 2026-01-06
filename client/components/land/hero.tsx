import { Badge } from "../ui/badge";
import Container from "../global/components/container";
import { ArrowRight } from "lucide-react";
import { heroConfig } from "@/config/land";
import { Button } from "../ui/button";
import { FlipWords } from "../ui/flip-words";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <Container className="flex flex-col gap-8 z-20">
      <div className="w-full flex flex-col items-center mt-20">
        <Badge className="flex items-center bg-white dark:bg-black text-black dark:text-white rounded-md border border-zinc-200 dark:border-zinc-800 py-1 text-xs shadow-lg">
          <span className="bg-black dark:bg-white text-white dark:text-black text-xs rounded-sm px-1">
            New
          </span>
          {heroConfig.badge}
          <ArrowRight />
        </Badge>
      </div>

      <div className="w-full flex flex-col gap-8 items-center">
        <div className="max-w-4xl flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl text-center tracking-tight font-fugaz">
            {heroConfig.line1}
          </h1>
          <h1 className="text-4xl md:text-5xl text-center tracking-tight font-fugaz leading-14">
            {heroConfig.line2}
            <span className="italic">
              <FlipWords
                words={heroConfig.words}
                duration={1000}
                className=" md:p-2 rounded-lg border bg-background border-dashed border-border text-[#94dbff]"
              />
            </span>
          </h1>
        </div>

        <p className="max-w-lg text-xs md:text-sm text-center text-md">
          {heroConfig.para}
        </p>
      </div>

      <div className=" flex items-center justify-center gap-4">
        {heroConfig.ctabtns.map((item, index) => (
          <Link href={item.link} key={index}>
            <Button
              className={`rounded-sm cursor-pointer ${
                item.type === "primary"
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-transparent hover:bg-zinc-200 dark:hover:bg-zinc-900 text-black dark:text-white"
              }`}
            >
              {item.title}
              {item.icon}
            </Button>
          </Link>
        ))}
      </div>

      <div className="w-full flex items-center justify-center mt-8 px-6">
        <Image
          src={heroConfig.heroImage.src}
          alt={heroConfig.heroImage.alt}
          width={1000}
          height={300}
          className="rounded-lg dark:invert"
        />
      </div>
    </Container>
  );
}
