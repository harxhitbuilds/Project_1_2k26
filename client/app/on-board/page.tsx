"use client";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { navConfig } from "@/config/navbar";

import Image from "next/image";

import { User } from "lucide-react";

import * as zod from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const onBoardSchema = zod.object({
  username: zod
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  skills: zod.string().min(1, "Please add at least one skill"),
});

type Inputs = zod.infer<typeof onBoardSchema>;

import { useAuthStore } from "@/store/auth.store";

export default function OnBoard() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(onBoardSchema),
  });
  const router = useRouter();
  const { onBoard } = useAuthStore();
  const { update } = useSession();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);

    const onBoardPromise = async () => {
      const skillsArray = data.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const updatedUser = await onBoard(data.username, skillsArray);
      await update({ onBoarded: true, user: updatedUser });
    };
    toast.promise(onBoardPromise(), {
      loading: "Completing your profile...",
      success: () => {
        router.push("/home");
        return "Profile completed successfully!";
      },
      error: (error) => {
        const errorMessage =
          error.response?.data?.message || "An error occurred.";
        setError("username", { type: "manual", message: errorMessage });
        return errorMessage;
      },
      finally: () => {
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-background p-4">
      <div className="flex items-center gap-2 absolute md:top-12 top-6 md:left-24 left-6">
        <Image
          src={navConfig.logo.src}
          alt={navConfig.logo.alt}
          height={30}
          width={30}
          className="dark:invert"
        />
        <h1 className="pb-1 font-semibold text-2xl">{navConfig.product}</h1>
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge variant="outline" className="py-1 px-3">
            <User className="mr-2 h-4 w-4" />
            One Last Step
          </Badge>
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Choose a unique username and list your skills.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4"
        >
          <div>
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              placeholder="your_unique_username"
              {...register("username")}
              className="mt-1"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="skills" className="text-sm font-medium">
              Skills
            </label>
            <Input
              id="skills"
              placeholder="e.g., React, Node.js, Figma"
              {...register("skills")}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter skills separated by commas.
            </p>
            {errors.skills && (
              <p className="text-red-500 text-sm mt-1">
                {errors.skills.message}
              </p>
            )}
          </div>

          <Button type="submit" className="rounded-xs py-6 mt-2">
            {isSubmitting ? <Spinner /> : "Complete Profile"}
          </Button>
        </form>
      </div>
    </div>
  );
}
