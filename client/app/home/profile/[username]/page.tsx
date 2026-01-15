"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { toast } from "sonner";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import IdeaCard from "@/components/global/cards/idea-card";
import EmptyState from "@/components/global/components/empty-state";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

import { Edit, Loader2, PlusCircle } from "lucide-react";
import { BsGithub, BsLinkedin, BsTwitterX } from "react-icons/bs";

import { useUserStore } from "@/store/user.store";
import { profileSchema } from "@/lib/validators/profile";

type ProfileInputs = zod.infer<typeof profileSchema>;

export default function Profile() {
  const { user, userIdeas, fetchProfile, updateProfile, fetching } =
    useUserStore();
  const { data: session, update } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const params = useParams();
  const username = params.username as string;

  const isMyProfile = session?.user?.username === username;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
  } = useForm<ProfileInputs>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (username) {
      fetchProfile(username).catch(() => {
        notFound();
      });
    }
  }, [username, fetchProfile]);

  useEffect(() => {
    if (isMyProfile && session?.user?.socialLinks) {
      reset(session.user.socialLinks);
    } else if (user?.socialLinks) {
      reset(user.socialLinks);
    }
  }, [user, session, reset, isMyProfile]);

  const onProfileUpdate: SubmitHandler<ProfileInputs> = async (data) => {
    try {
      const updatedUser = await updateProfile(data);
      update({
        ...session,
        user: { ...session?.user, socialLinks: updatedUser.socialLinks },
      });
      toast.success("Profile updated successfully!");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const hasSocialLinks =
    user?.socialLinks && Object.values(user.socialLinks).some((link) => link);

  if (fetching || !user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
        <div className="flex items-center gap-6">
          <Avatar className="h-28 w-28 rounded-2xl border-2 border-border bg-background p-1">
            <AvatarImage src={user?.profile} className="rounded-xl" />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="font-bold text-3xl">{user?.name}</h1>
            <p className="text-sm text-muted-foreground">
              Joined on {new Date(user?.createdAt!).toLocaleDateString()}
            </p>
          </div>
        </div>
        {isMyProfile && (
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" /> Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Your Profile</DialogTitle>
                  <DialogDescription>
                    Add or update your social media links.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(onProfileUpdate)}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      placeholder="https://github.com/username"
                      {...register("github")}
                    />
                    {errors.github && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.github.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedIn"
                      placeholder="https://linkedin.com/in/username"
                      {...register("linkedIn")}
                    />
                    {errors.linkedIn && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.linkedIn.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter / X</Label>
                    <Input
                      id="twitter"
                      placeholder="https://twitter.com/username"
                      {...register("x")}
                    />
                    {errors.x && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.x.message}
                      </p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Link href="/home/post">
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Post Idea
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Separator />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-3">
          <h2 className="text-lg font-semibold">Skills</h2>
          {user?.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill: string, index) => (
                <Badge variant="secondary" key={index}>
                  {skill}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skills added.</p>
          )}
        </div>
        <div className="md:col-span-2 space-y-3">
          <h2 className="text-lg font-semibold">Socials</h2>
          {hasSocialLinks ? (
            <div className="flex items-center gap-2">
              {user?.socialLinks?.github && (
                <a
                  href={user.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="icon">
                    <BsGithub className="h-4 w-4" />
                  </Button>
                </a>
              )}
              {user?.socialLinks?.linkedIn && (
                <a
                  href={user.socialLinks.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="icon">
                    <BsLinkedin className="h-4 w-4" />
                  </Button>
                </a>
              )}
              {user?.socialLinks?.x && (
                <a
                  href={user.socialLinks.x}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="icon">
                    <BsTwitterX className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No social links added yet.
            </p>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-4 pb-10">
        <h2 className="text-2xl font-bold">
          {isMyProfile ? "My Ideas" : `${user?.name}'s Ideas`}
        </h2>
        {userIdeas.length === 0 ? (
          <EmptyState
            title="No ideas here yet"
            description={
              isMyProfile
                ? "Click the 'Post Idea' button to share your first project concept."
                : "This user hasn't posted any ideas yet."
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {userIdeas.map((item, index) => (
              <IdeaCard key={index} idea={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value = 0 }: { label: string; value?: number }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground p-4">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
