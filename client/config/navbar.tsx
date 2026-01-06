import { ChevronDown } from "lucide-react";

export const navConfig = {
  product: "Alloy",
  logo: {
    src: "/assets/logo.svg",
    alt: "Product Name",
  },
  links: [
    {
      title: "Product",
      link: "#",
      icon: <ChevronDown className="h-4 w-4" />,
    },
    {
      title: "Why Us",
      link: "#",
      icon: <ChevronDown className="h-4 w-4" />,
    },
    {
      title: "Customer",
      link: "#",
    },
    {
      title: "Pricing",
      link: "#",
    },
  ],
  buttons: [
    {
      title: "Get Started",
      link: "/auth",
    },
  ],
};
