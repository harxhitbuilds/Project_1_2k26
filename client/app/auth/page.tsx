"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

import { BsGoogle, BsGithub } from "react-icons/bs";
import { Lock } from "lucide-react";

import { navConfig } from "@/config/navbar";

import Image from "next/image";

import { signIn } from "next-auth/react";

import { toast } from "sonner";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState<"google" | "github" | null>(null);
  const handleSignIn = async (provider: "google" | "github") => {
    setIsLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/home" });
    } catch (error) {
      toast.error("An unexpected error occurred during sign-in.");
      setIsLoading(null);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-popover">
      <div className="flex items-center gap-2 absolute md:top-12 top-12 md:left-24">
        <Image
          src={navConfig.logo.src}
          alt={navConfig.logo.src}
          height={30}
          width={30}
          className="dark:invert"
        />
        <h1 className="pb-1 font-semibold text-2xl">{navConfig.product}</h1>
      </div>

      <div className="w-xs flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-8">
          <Badge>
            <Lock />
            Log In
          </Badge>
          <h1 className="text-3xl font-bold">Log into Alloy</h1>
        </div>
        <div className="w-full flex flex-col gap-4">
          <Button
            onClick={() => handleSignIn("google")}
            disabled={!!isLoading}
            className="rounded-xs py-6 border border-border cursor-pointer"
          >
            {isLoading === "google" ? (
              <Spinner />
            ) : (
              <BsGoogle className="mr-2" />
            )}{" "}
            Continue In with Google
          </Button>
          <Button
            disabled
            className="rounded-xs py-6 border border-border cursor-pointer"
          >
            <BsGithub /> Continue In with Github
          </Button>
        </div>
      </div>
    </div>
  );
}
