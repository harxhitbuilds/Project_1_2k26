import { ArrowRight } from "lucide-react";
export const heroConfig = {
  line1: "Enter with an Idea.",
  line2: "Leave with a Team That ",
  words: ["Build!", "Ship!", "Design!", "Develop!"],
  para: `Turn raw ideas into real products. Share your vision, find skilled collaborators,
and execute faster with a focused, builder-first platform.`,
  badge: "From idea to execution all in one place",
  ctabtns: [
    {
      title: "Start Building",
      link: "/auth",
      type: "primary",
    },
    {
      title: "How It Works",
      link: "#",
      type: "secondary",
      icon: <ArrowRight />,
    },
  ],
  heroImage: {
    src: "/assets/hero-img.webp",
    alt: "Collaborative team building ideas together",
  },
};
