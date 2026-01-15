"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { ideaSchema, IdeaFormData } from "@/lib/validators/idea";
import { useIdeaStore } from "@/store/idea.store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function PostIdeaForm() {
  const router = useRouter();
  const { uploadIdea, loading } = useIdeaStore();
  const [techInput, setTechInput] = useState("");
  const [reqInput, setReqInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IdeaFormData>({
    resolver: zodResolver(ideaSchema),
    defaultValues: {
      title: "",
      description: "",
      technologies: [],
      status: "open",
      lookingForCollaboratos: false,
      requirements: [],
    },
  });

  const technologies = watch("technologies");
  const requirements = watch("requirements");
  const lookingForCollaborators = watch("lookingForCollaboratos");

  const addTechnology = () => {
    if (!techInput.trim()) return;
    if (technologies.includes(techInput.trim())) return;
    setValue("technologies", [...technologies, techInput.trim()]);
    setTechInput("");
  };

  const removeTechnology = (tech: string) => {
    setValue(
      "technologies",
      technologies.filter((t) => t !== tech)
    );
  };

  const addRequirement = () => {
    if (!reqInput.trim()) return;
    if (requirements.includes(reqInput.trim())) return;
    setValue("requirements", [...requirements, reqInput.trim()]);
    setReqInput("");
  };

  const removeRequirement = (req: string) => {
    setValue(
      "requirements",
      requirements.filter((r) => r !== req)
    );
  };

  const onSubmit = async (data: IdeaFormData) => {
    const transformedData = {
      ...data,
      technologies: data.technologies.map((tech) => ({ name: tech })),
      requirements: data.lookingForCollaboratos
        ? data.requirements.map((role) => role)
        : [],
    };
    await uploadIdea(transformedData, () => {
      router.push("/home");
    });
  };

  return (
    <Card className="max-w-2xl mx-auto bg-transparent border-none">
      <CardHeader>
        <CardTitle className="text-xl">Post a New Idea</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="My awesome project idea"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Explain the idea in detail..."
              className="min-h-[120px]"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Technologies</Label>
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTechnology())
                }
                placeholder="e.g., React, Node.js"
              />
              <Button type="button" onClick={addTechnology}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[24px]">
              {technologies.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => removeTechnology(tech)}
                >
                  {tech} &times;
                </Badge>
              ))}
            </div>
            {errors.technologies && (
              <p className="text-sm text-red-500">
                {errors.technologies.message}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="lookingForCollaboratos"
              checked={lookingForCollaborators}
              onCheckedChange={(checked: boolean) =>
                setValue("lookingForCollaboratos", checked)
              }
            />
            <Label htmlFor="lookingForCollaboratos">
              Are you looking for collaborators?
            </Label>
          </div>

          {lookingForCollaborators && (
            <div className="space-y-2">
              <Label>What roles are you looking for?</Label>
              <div className="flex gap-2">
                <Input
                  value={reqInput}
                  onChange={(e) => setReqInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addRequirement())
                  }
                  placeholder="e.g., Frontend Developer"
                />
                <Button type="button" onClick={addRequirement}>
                  Add Role
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[24px]">
                {requirements.map((req) => (
                  <Badge
                    key={req}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeRequirement(req)}
                  >
                    {req} &times;
                  </Badge>
                ))}
              </div>
              {errors.requirements && (
                <p className="text-sm text-red-500">
                  {errors.requirements.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Label>Current Status</Label>
            <Select
              defaultValue="open"
              onValueChange={(value) =>
                setValue("status", value as IdeaFormData["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open for Collaboration</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Publishing..." : "Publish Idea"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
